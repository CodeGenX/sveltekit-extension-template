/**
 * Network Service
 *
 * Provides HTTP communication with the QuickBooks backend using CloudEvents protocol.
 * Includes retry logic with exponential backoff, timeout support, and comprehensive error handling.
 *
 * @module network
 */

import {
	encodeCloudEvent,
	decodeCloudEvent,
	type CloudEvent,
	type DecodedCloudEvent
} from '$lib/utils/cloudEvent';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Options for HTTP requests
 */
export interface RequestOptions {
	/** Request timeout in milliseconds (default: 5000ms) */
	timeout?: number;
	/** Maximum number of retry attempts (default: 3) */
	retries?: number;
	/** Custom HTTP headers to include with request */
	headers?: Record<string, string>;
	/** Optional logger function for debugging */
	logger?: (message: string) => void;
}

/**
 * Internal retry state tracking
 */
interface RetryState {
	attempt: number;
	maxRetries: number;
	lastError?: Error;
}

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Network error - connection failures, DNS errors, etc.
 */
export class NetworkError extends Error {
	constructor(
		message: string,
		public readonly cause?: unknown
	) {
		super(message);
		this.name = 'NetworkError';
	}
}

/**
 * Timeout error - request exceeded timeout duration
 */
export class TimeoutError extends Error {
	constructor(
		message: string,
		public readonly timeoutMs: number
	) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
 * HTTP error - non-2xx status code
 */
export class HTTPError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly statusText: string,
		public readonly responseBody?: string
	) {
		super(message);
		this.name = 'HTTPError';
	}
}

/**
 * QuickBooks error - QB returned error status code
 */
export class QBError extends Error {
	constructor(
		message: string,
		public readonly statusCode: string,
		public readonly severity: string
	) {
		super(message);
		this.name = 'QBError';
	}
}

/**
 * Parse error - failed to parse response
 */
export class ParseError extends Error {
	constructor(
		message: string,
		public readonly cause?: unknown
	) {
		super(message);
		this.name = 'ParseError';
	}
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sleep for specified milliseconds
 * @param ms - Milliseconds to sleep
 * @internal
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 * @param attempt - Current attempt number (1-indexed)
 * @returns Delay in milliseconds
 * @internal
 */
function calculateBackoff(attempt: number): number {
	// Exponential backoff: 1000ms, 2000ms, 4000ms
	return Math.pow(2, attempt - 1) * 1000;
}

/**
 * Check if error is retryable
 * @param error - Error to check
 * @returns True if error should trigger retry
 * @internal
 */
function isRetryableError(error: unknown): boolean {
	// Retry on network errors and timeouts
	// Do NOT retry on HTTP errors (4xx/5xx) or QB errors
	return (
		error instanceof NetworkError ||
		error instanceof TimeoutError ||
		(error instanceof TypeError && error.message.includes('fetch'))
	);
}

/**
 * Create abort controller with timeout
 * @param timeoutMs - Timeout in milliseconds
 * @param logger - Optional logger
 * @returns AbortController and cleanup function
 * @internal
 */
function createTimeoutController(
	timeoutMs: number,
	logger?: (message: string) => void
): { controller: AbortController; cleanup: () => void } {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		logger?.(`Request timeout after ${timeoutMs}ms - aborting`);
		controller.abort();
	}, timeoutMs);

	const cleanup = () => {
		clearTimeout(timeoutId);
	};

	return { controller, cleanup };
}

// ============================================================================
// Core HTTP Functions
// ============================================================================

/**
 * Posts a CloudEvent to the backend with retry logic and timeout support.
 *
 * Automatically retries on transient network failures with exponential backoff.
 * Does NOT retry on HTTP errors (4xx/5xx) or QuickBooks errors.
 *
 * @param url - Backend endpoint URL
 * @param cloudEvent - CloudEvent to send
 * @param options - Request options (timeout, retries, headers, logger)
 * @returns Decoded CloudEvent response with QB data
 * @throws {NetworkError} On network/connection failures
 * @throws {TimeoutError} On request timeout
 * @throws {HTTPError} On non-2xx HTTP status
 * @throws {QBError} On QuickBooks error response (non-zero statusCode)
 * @throws {ParseError} On response parsing failure
 *
 * @example
 * const cloudEvent = encodeCloudEvent(
 *   "com.quickbooks.bill.add",
 *   "qb-chrome-extension",
 *   qbxmlData
 * );
 *
 * try {
 *   const response = await postCloudEvent("http://localhost:3000/api/qb", cloudEvent);
 *   console.log("Success:", response.transactionDetails);
 * } catch (error) {
 *   if (error instanceof QBError) {
 *     console.error("QB Error:", error.message);
 *   } else if (error instanceof TimeoutError) {
 *     console.error("Request timed out");
 *   }
 * }
 */
export async function postCloudEvent(
	url: string,
	cloudEvent: CloudEvent,
	options: RequestOptions = {}
): Promise<DecodedCloudEvent> {
	const {
		timeout = 5000,
		retries = 3,
		headers = {},
		logger
	} = options;

	logger?.(` Posting CloudEvent to ${url}`);
	logger?.(`CloudEvent ID: ${cloudEvent.id}, Type: ${cloudEvent.type}`);

	const retryState: RetryState = {
		attempt: 0,
		maxRetries: retries
	};

	// Retry loop
	while (retryState.attempt < retryState.maxRetries) {
		retryState.attempt++;
		logger?.(` Attempt ${retryState.attempt}/${retryState.maxRetries}`);

		try {
			// Create abort controller for timeout
			const { controller, cleanup } = createTimeoutController(timeout, logger);

			try {
				// Make HTTP request
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						...headers
					},
					body: JSON.stringify(cloudEvent),
					signal: controller.signal
				});

				cleanup();

				logger?.(`Response status: ${response.status} ${response.statusText}`);

				// Check HTTP status
				if (!response.ok) {
					const responseBody = await response.text();
					logger?.(`HTTP error response body: ${responseBody}`);
					throw new HTTPError(
						`HTTP ${response.status}: ${response.statusText}`,
						response.status,
						response.statusText,
						responseBody
					);
				}

				// Parse response
				const responseText = await response.text();
				logger?.(`Response received (${responseText.length} bytes)`);

				let rawPayload: unknown;
				try {
					rawPayload = JSON.parse(responseText);
				} catch (parseError) {
					throw new ParseError(
						'Failed to parse JSON response',
						parseError
					);
				}

				// Decode CloudEvent
				let decoded: DecodedCloudEvent;
				try {
					decoded = decodeCloudEvent(rawPayload);
				} catch (decodeError) {
					throw new ParseError(
						'Failed to decode CloudEvent response',
						decodeError
					);
				}

				// Check QB status code
				if (decoded.responseAttributes) {
					const { statusCode, statusMessage, statusSeverity } = decoded.responseAttributes;

					if (statusCode !== '0') {
						logger?.(`QB Error: statusCode=${statusCode}, severity=${statusSeverity}, message=${statusMessage}`);
						throw new QBError(
							`QuickBooks Error: ${statusMessage}`,
							statusCode,
							statusSeverity
						);
					}

					logger?.(`✅ QB Success: ${statusMessage}`);
				}

				logger?.(`Request completed successfully`);
				return decoded;

			} catch (error) {
				cleanup();

				// Handle abort (timeout)
				if (error instanceof Error && error.name === 'AbortError') {
					throw new TimeoutError(
						`Request timeout after ${timeout}ms`,
						timeout
					);
				}

				// Re-throw already categorized errors
				if (
					error instanceof HTTPError ||
					error instanceof QBError ||
					error instanceof ParseError ||
					error instanceof TimeoutError
				) {
					throw error;
				}

				// Network/fetch errors
				throw new NetworkError(
					`Network request failed: ${error instanceof Error ? error.message : String(error)}`,
					error
				);
			}

		} catch (error) {
			retryState.lastError = error instanceof Error ? error : new Error(String(error));

			// Don't retry on non-retryable errors
			if (!isRetryableError(error)) {
				logger?.(`Non-retryable error: ${retryState.lastError.name}`);
				throw retryState.lastError;
			}

			// Don't retry if this was the last attempt
			if (retryState.attempt >= retryState.maxRetries) {
				logger?.(`Max retries (${retryState.maxRetries}) exceeded`);
				throw retryState.lastError;
			}

			// Calculate backoff delay
			const delay = calculateBackoff(retryState.attempt);
			logger?.(`⚠️ ${retryState.lastError.name}: ${retryState.lastError.message}`);
			logger?.(`Retrying in ${delay}ms...`);

			// Wait before retry
			await sleep(delay);
		}
	}

	// Should never reach here, but TypeScript needs this
	throw retryState.lastError || new NetworkError('Request failed after all retries');
}

/**
 * Helper function to send CloudEvent with automatic encoding.
 *
 * Convenience wrapper around postCloudEvent that handles CloudEvent encoding.
 *
 * @param url - Backend endpoint URL
 * @param type - CloudEvent type (e.g., "com.quickbooks.bill.add")
 * @param source - CloudEvent source (e.g., "qb-chrome-extension")
 * @param data - QBXML or other payload data
 * @param options - Request options
 * @returns Decoded CloudEvent response
 *
 * @example
 * const qbxmlData = { QBXML: { QBXMLMsgsRq: { BillAddRq: {...} } } };
 * const response = await sendCloudEventToBackend(
 *   "http://localhost:3000/api/qb",
 *   "com.quickbooks.bill.add",
 *   "qb-chrome-extension",
 *   qbxmlData
 * );
 */
export async function sendCloudEventToBackend(
	url: string,
	type: string,
	source: string,
	data: unknown,
	options: RequestOptions = {}
): Promise<DecodedCloudEvent> {
	const cloudEvent = encodeCloudEvent(type, source, data);
	return postCloudEvent(url, cloudEvent, options);
}
