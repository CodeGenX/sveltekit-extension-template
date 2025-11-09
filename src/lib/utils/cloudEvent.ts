/**
 * CloudEvent Utilities
 *
 * Provides type-safe CloudEvent 1.0 protocol encoding/decoding for QuickBooks Desktop integration.
 * Handles QBXML request/response wrapping in CloudEvents format.
 *
 * @see https://github.com/cloudevents/spec/blob/v1.0/spec.md CloudEvents 1.0 Specification
 * @see https://datatracker.ietf.org/doc/html/rfc4122 RFC 4122 UUID Format
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * CloudEvent metadata fields as defined by CloudEvents 1.0 specification.
 *
 * @see https://github.com/cloudevents/spec/blob/v1.0/spec.md#required-attributes
 */
export interface CloudEventMeta {
	/** CloudEvents specification version (always "1.0") */
	specversion: string;
	/** Unique identifier for this event (UUID v4) */
	id: string;
	/** Context in which the event occurred (e.g., "qb-chrome-extension") */
	source: string;
	/** Type of event (e.g., "com.quickbooks.bill.add") */
	type: string;
	/** Timestamp when event occurred (ISO 8601 format) */
	time: string;
	/** Content type of the data field (e.g., "application/json") */
	datacontenttype?: string;
	/** URI of the schema that the data field adheres to */
	dataschema?: string;
}

/**
 * QBXML response attributes returned by QuickBooks Desktop.
 * These are parsed from the QBXML response envelope.
 */
export interface QbxmlResponseAttributes {
	/** Request identifier */
	requestID: string;
	/** Status code (0 = success, non-zero = error) */
	statusCode: string;
	/** Human-readable status message */
	statusMessage: string;
	/** Severity level (Info, Warn, Error) */
	statusSeverity: string;
}

/**
 * Transaction details extracted from QBXML responses.
 * Structure matches QB Desktop transaction fields.
 */
export interface TransactionDetails {
	/** Whether the bill/transaction is paid */
	IsPaid: string;
	/** Remaining unpaid amount */
	OpenAmount: string;
	/** Reference number for the transaction */
	RefNumber: string;
	/** Timestamp when transaction was created */
	TimeCreated: string;
	/** Timestamp when transaction was last modified */
	TimeModified: string;
	/** Date of the transaction */
	TxnDate: string;
	/** Transaction ID (unique identifier in QB) */
	TxnID: string;
	/** Transaction number */
	TxnNumber: string;
	/** Payment terms reference */
	TermsRef: {
		FullName: string;
		ListID: string;
	};
	/** Vendor reference */
	VendorRef: {
		FullName: string;
		ListID: string;
	};
}

/**
 * Complete CloudEvent structure conforming to CloudEvents 1.0 specification.
 */
export interface CloudEvent extends CloudEventMeta {
	/** Event payload (QBXML for our use case) */
	data: unknown;
}

/**
 * Decoded CloudEvent response with parsed QBXML data.
 */
export interface DecodedCloudEvent {
	/** CloudEvent metadata fields */
	meta: CloudEventMeta;
	/** Parsed QBXML response attributes (null if not present) */
	responseAttributes: QbxmlResponseAttributes | null;
	/** Parsed transaction details (null if not present) */
	transactionDetails: TransactionDetails | null;
}

// ============================================================================
// UUID Generation
// ============================================================================

/**
 * Generates a UUID v4 compliant unique identifier for CloudEvents.
 *
 * Uses crypto.randomUUID() when available (modern browsers/Node 16+),
 * falls back to manual implementation for SSR or older environments.
 *
 * @returns {string} UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *
 * @example
 * const eventId = generateEventId();
 * // => "550e8400-e29b-41d4-a716-446655440000"
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4122#section-4.4
 */
export function generateEventId(): string {
	// SSR safety: Check if crypto API is available
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	// Fallback implementation for SSR or older environments
	// UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
	// where x is any hexadecimal digit and y is one of 8, 9, A, or B
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// ============================================================================
// CloudEvent Encoding
// ============================================================================

/**
 * Encodes QBXML data into a CloudEvents 1.0 compliant structure.
 *
 * Creates a CloudEvent envelope with required metadata fields and embeds
 * the QBXML payload in the data field for transmission to the backend.
 *
 * @param {string} type - Event type (e.g., "com.quickbooks.bill.add")
 * @param {string} source - Event source context (e.g., "qb-chrome-extension")
 * @param {unknown} data - QBXML payload to embed in the CloudEvent
 * @returns {CloudEvent} CloudEvents 1.0 compliant structure
 *
 * @example
 * const qbxml = { QBXML: { QBXMLMsgsRq: { BillAddRq: {...} } } };
 * const cloudEvent = encodeCloudEvent(
 *   "com.quickbooks.bill.add",
 *   "qb-chrome-extension",
 *   qbxml
 * );
 * // CloudEvent with id, type, source, specversion, time, datacontenttype, and data
 *
 * @see https://github.com/cloudevents/spec/blob/v1.0/spec.md#required-attributes
 */
export function encodeCloudEvent(
	type: string,
	source: string,
	data: unknown
): CloudEvent {
	return {
		specversion: '1.0',
		id: generateEventId(),
		source,
		type,
		time: new Date().toISOString(),
		datacontenttype: 'application/json',
		data
	};
}

// ============================================================================
// CloudEvent Decoding
// ============================================================================

/**
 * Decodes a CloudEvent response and extracts QBXML data.
 *
 * Parses the CloudEvent envelope, extracts metadata, and navigates the
 * QBXML response structure to extract response attributes and transaction details.
 *
 * @param {unknown} rawPayload - Raw CloudEvent JSON object from backend
 * @returns {DecodedCloudEvent} Parsed CloudEvent with metadata and QBXML data
 * @throws {Error} If payload is invalid or missing required CloudEvent fields
 *
 * @example
 * const response = await fetch('/api/qb', { method: 'POST', body: cloudEvent });
 * const rawPayload = await response.json();
 * const decoded = decodeCloudEvent(rawPayload);
 *
 * if (decoded.responseAttributes?.statusCode === '0') {
 *   console.log('Success:', decoded.transactionDetails);
 * } else {
 *   console.error('QB Error:', decoded.responseAttributes?.statusMessage);
 * }
 *
 * @see https://github.com/cloudevents/spec/blob/v1.0/spec.md
 */
export function decodeCloudEvent(rawPayload: unknown): DecodedCloudEvent {
	// Type guard: Validate rawPayload is an object
	if (!rawPayload || typeof rawPayload !== 'object') {
		throw new Error('Invalid CloudEvent: payload must be an object');
	}

	const payload = rawPayload as Record<string, unknown>;

	// Extract and validate required CloudEvent metadata fields
	const requiredFields: (keyof CloudEventMeta)[] = [
		'specversion',
		'id',
		'source',
		'type',
		'time'
	];

	const meta: Partial<CloudEventMeta> = {};
	for (const field of requiredFields) {
		if (payload[field] === undefined) {
			throw new Error(`Invalid CloudEvent: missing required field '${field}'`);
		}
		meta[field] = payload[field] as string;
	}

	// Optional fields
	if (payload.datacontenttype !== undefined) {
		meta.datacontenttype = payload.datacontenttype as string;
	}
	if (payload.dataschema !== undefined) {
		meta.dataschema = payload.dataschema as string;
	}

	// Extract QBXML response attributes and transaction details
	const responseAttributes = extractResponseAttributes(payload.data);
	const transactionDetails = extractTransactionDetails(payload.data);

	return {
		meta: meta as CloudEventMeta,
		responseAttributes,
		transactionDetails
	};
}

/**
 * Extracts QBXML response attributes from the data field.
 *
 * Navigates the QBXML structure: data.QBXML.QBXMLMsgsRs.[ResponseType]
 * and extracts statusCode, statusMessage, statusSeverity, requestID.
 *
 * @param {unknown} data - CloudEvent data field
 * @returns {QbxmlResponseAttributes | null} Parsed response attributes or null if not found
 * @internal
 */
function extractResponseAttributes(data: unknown): QbxmlResponseAttributes | null {
	if (!data || typeof data !== 'object') {
		return null;
	}

	const dataObj = data as Record<string, unknown>;
	const qbxml = dataObj.QBXML as Record<string, unknown> | undefined;
	if (!qbxml || typeof qbxml !== 'object') {
		return null;
	}

	const qbxmlMsgsRs = qbxml.QBXMLMsgsRs as Record<string, unknown> | undefined;
	if (!qbxmlMsgsRs || typeof qbxmlMsgsRs !== 'object') {
		return null;
	}

	// Find the first response key that doesn't start with @ (e.g., "BillAddRs", "VendorQueryRs")
	const responseKey = Object.keys(qbxmlMsgsRs).find((key) => !key.startsWith('@'));
	if (!responseKey) {
		return null;
	}

	const specificResponse = qbxmlMsgsRs[responseKey] as Record<string, unknown> | undefined;
	if (!specificResponse || typeof specificResponse !== 'object') {
		return null;
	}

	// Extract attributes from the specific response object
	return {
		requestID: (specificResponse['@requestID'] as string) || (qbxmlMsgsRs['@requestID'] as string) || 'N/A',
		statusCode: (specificResponse['@statusCode'] as string) || 'N/A',
		statusMessage: (specificResponse['@statusMessage'] as string) || 'N/A',
		statusSeverity: (specificResponse['@statusSeverity'] as string) || 'N/A'
	};
}

/**
 * Extracts transaction details from the QBXML response structure.
 *
 * Navigates the QBXML structure: data.QBXML.QBXMLMsgsRs.[ResponseType].[RetType]
 * and extracts transaction-specific fields.
 *
 * @param {unknown} data - CloudEvent data field
 * @returns {TransactionDetails | null} Parsed transaction details or null if not found
 * @internal
 */
function extractTransactionDetails(data: unknown): TransactionDetails | null {
	if (!data || typeof data !== 'object') {
		return null;
	}

	const dataObj = data as Record<string, unknown>;
	const qbxml = dataObj.QBXML as Record<string, unknown> | undefined;
	if (!qbxml || typeof qbxml !== 'object') {
		return null;
	}

	const qbxmlMsgsRs = qbxml.QBXMLMsgsRs as Record<string, unknown> | undefined;
	if (!qbxmlMsgsRs || typeof qbxmlMsgsRs !== 'object') {
		return null;
	}

	// Find the response type key (e.g., "BillAddRs", "VendorQueryRs")
	const txnResponseKey = Object.keys(qbxmlMsgsRs).find(
		(key) => !key.startsWith('@') && typeof qbxmlMsgsRs[key] === 'object'
	);
	if (!txnResponseKey) {
		return null;
	}

	const txnResponse = qbxmlMsgsRs[txnResponseKey] as Record<string, unknown>;
	if (!txnResponse || typeof txnResponse !== 'object') {
		return null;
	}

	// Find the Ret object (e.g., "BillRet", "VendorRet")
	const retKey = Object.keys(txnResponse).find(
		(key) => !key.startsWith('@') && key.endsWith('Ret')
	);
	if (!retKey) {
		return null;
	}

	let txnDetails = txnResponse[retKey] as Record<string, unknown> | Record<string, unknown>[];

	// Handle both array and object cases
	if (Array.isArray(txnDetails) && txnDetails.length > 0) {
		txnDetails = txnDetails[0];
	}

	if (!txnDetails || typeof txnDetails !== 'object' || Array.isArray(txnDetails)) {
		return null;
	}

	// Extract transaction details with defaults
	return {
		IsPaid: (txnDetails.IsPaid as string) || 'false',
		OpenAmount: (txnDetails.OpenAmount as string) || '0.00',
		RefNumber: (txnDetails.RefNumber as string) || '',
		TimeCreated: (txnDetails.TimeCreated as string) || '',
		TimeModified: (txnDetails.TimeModified as string) || '',
		TxnDate: (txnDetails.TxnDate as string) || '',
		TxnID: (txnDetails.TxnID as string) || '',
		TxnNumber: (txnDetails.TxnNumber as string) || '',
		TermsRef: {
			FullName: ((txnDetails.TermsRef as Record<string, unknown>)?.FullName as string) || '',
			ListID: ((txnDetails.TermsRef as Record<string, unknown>)?.ListID as string) || ''
		},
		VendorRef: {
			FullName: ((txnDetails.VendorRef as Record<string, unknown>)?.FullName as string) || '',
			ListID: ((txnDetails.VendorRef as Record<string, unknown>)?.ListID as string) || ''
		}
	};
}
