/**
 * CloudEvent Utilities - Unit Tests
 *
 * Comprehensive test suite for CloudEvent encoding/decoding utilities.
 * Tests UUID generation, CloudEvents 1.0 compliance, QBXML parsing, and error handling.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	generateEventId,
	encodeCloudEvent,
	decodeCloudEvent,
	type CloudEvent,
	type CloudEventMeta,
	type QbxmlResponseAttributes,
	type TransactionDetails
} from './cloudEvent';

// ============================================================================
// UUID Generation Tests
// ============================================================================

describe('generateEventId', () => {
	it('should generate a valid UUID v4 format', () => {
		const uuid = generateEventId();

		// UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
		// where x is any hex digit and y is one of [89ab]
		const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		expect(uuid).toMatch(uuidV4Regex);
	});

	it('should generate unique IDs on repeated calls', () => {
		const id1 = generateEventId();
		const id2 = generateEventId();
		const id3 = generateEventId();

		expect(id1).not.toBe(id2);
		expect(id2).not.toBe(id3);
		expect(id1).not.toBe(id3);
	});

	it('should handle SSR environment where crypto is undefined', () => {
		// Mock SSR environment (no crypto API) using vi.stubGlobal
		vi.stubGlobal('crypto', undefined);

		const uuid = generateEventId();

		// Should still generate valid UUID v4 using fallback
		const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		expect(uuid).toMatch(uuidV4Regex);

		// Restore crypto
		vi.unstubAllGlobals();
	});

	it('should handle environment where crypto.randomUUID is unavailable', () => {
		// Mock environment with crypto but no randomUUID
		vi.stubGlobal('crypto', {});

		const uuid = generateEventId();

		// Should use fallback implementation
		const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		expect(uuid).toMatch(uuidV4Regex);

		// Restore crypto
		vi.unstubAllGlobals();
	});
});

// ============================================================================
// CloudEvent Encoding Tests
// ============================================================================

describe('encodeCloudEvent', () => {
	const mockQbxml = {
		QBXML: {
			QBXMLMsgsRq: {
				BillAddRq: {
					VendorRef: { FullName: 'Test Vendor' },
					TxnDate: '2025-11-08',
					AmountDue: '1500.00'
				}
			}
		}
	};

	it('should create CloudEvent with all required fields', () => {
		const cloudEvent = encodeCloudEvent(
			'com.quickbooks.bill.add',
			'qb-chrome-extension',
			mockQbxml
		);

		expect(cloudEvent).toHaveProperty('id');
		expect(cloudEvent).toHaveProperty('type');
		expect(cloudEvent).toHaveProperty('source');
		expect(cloudEvent).toHaveProperty('specversion');
		expect(cloudEvent).toHaveProperty('time');
		expect(cloudEvent).toHaveProperty('data');
	});

	it('should set specversion to 1.0', () => {
		const cloudEvent = encodeCloudEvent(
			'com.quickbooks.bill.add',
			'qb-chrome-extension',
			mockQbxml
		);

		expect(cloudEvent.specversion).toBe('1.0');
	});

	it('should set type and source from parameters', () => {
		const type = 'com.quickbooks.vendor.query';
		const source = 'qb-chrome-extension-test';

		const cloudEvent = encodeCloudEvent(type, source, mockQbxml);

		expect(cloudEvent.type).toBe(type);
		expect(cloudEvent.source).toBe(source);
	});

	it('should generate a valid UUID v4 for id field', () => {
		const cloudEvent = encodeCloudEvent(
			'com.quickbooks.bill.add',
			'qb-chrome-extension',
			mockQbxml
		);

		const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		expect(cloudEvent.id).toMatch(uuidV4Regex);
	});

	it('should include ISO 8601 timestamp in time field', () => {
		const cloudEvent = encodeCloudEvent(
			'com.quickbooks.bill.add',
			'qb-chrome-extension',
			mockQbxml
		);

		// ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
		const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
		expect(cloudEvent.time).toMatch(iso8601Regex);

		// Should be a valid date
		const date = new Date(cloudEvent.time);
		expect(date.toString()).not.toBe('Invalid Date');
	});

	it('should set datacontenttype to application/json', () => {
		const cloudEvent = encodeCloudEvent(
			'com.quickbooks.bill.add',
			'qb-chrome-extension',
			mockQbxml
		);

		expect(cloudEvent.datacontenttype).toBe('application/json');
	});

	it('should embed QBXML data in data field', () => {
		const cloudEvent = encodeCloudEvent(
			'com.quickbooks.bill.add',
			'qb-chrome-extension',
			mockQbxml
		);

		expect(cloudEvent.data).toEqual(mockQbxml);
	});

	it('should handle empty data payload', () => {
		const cloudEvent = encodeCloudEvent(
			'com.quickbooks.test',
			'qb-chrome-extension',
			null
		);

		expect(cloudEvent.data).toBeNull();
		expect(cloudEvent.specversion).toBe('1.0');
	});
});

// ============================================================================
// CloudEvent Decoding Tests
// ============================================================================

describe('decodeCloudEvent', () => {
	const createMockCloudEvent = (overrides: Partial<CloudEvent> = {}): CloudEvent => ({
		specversion: '1.0',
		id: '550e8400-e29b-41d4-a716-446655440000',
		source: 'qb-backend',
		type: 'com.quickbooks.bill.add.response',
		time: '2025-11-08T10:30:00.000Z',
		datacontenttype: 'application/json',
		data: {
			QBXML: {
				QBXMLMsgsRs: {
					'@requestID': '1',
					BillAddRs: {
						'@requestID': '1',
						'@statusCode': '0',
						'@statusMessage': 'Success',
						'@statusSeverity': 'Info',
						BillRet: {
							TxnID: 'ABC-123',
							TxnNumber: '12345',
							TxnDate: '2025-11-08',
							RefNumber: 'BILL-001',
							IsPaid: 'false',
							OpenAmount: '1500.00',
							TimeCreated: '2025-11-08T10:00:00',
							TimeModified: '2025-11-08T10:30:00',
							VendorRef: {
								ListID: 'VENDOR-001',
								FullName: 'Test Vendor Inc.'
							},
							TermsRef: {
								ListID: 'TERMS-001',
								FullName: 'Net 30'
							}
						}
					}
				}
			}
		},
		...overrides
	});

	it('should extract CloudEvent meta fields correctly', () => {
		const mockEvent = createMockCloudEvent();
		const decoded = decodeCloudEvent(mockEvent);

		expect(decoded.meta).toEqual({
			specversion: '1.0',
			id: '550e8400-e29b-41d4-a716-446655440000',
			source: 'qb-backend',
			type: 'com.quickbooks.bill.add.response',
			time: '2025-11-08T10:30:00.000Z',
			datacontenttype: 'application/json'
		});
	});

	it('should parse QB response attributes with statusCode 0 (success)', () => {
		const mockEvent = createMockCloudEvent();
		const decoded = decodeCloudEvent(mockEvent);

		expect(decoded.responseAttributes).toEqual({
			requestID: '1',
			statusCode: '0',
			statusMessage: 'Success',
			statusSeverity: 'Info'
		});
	});

	it('should handle error response with non-zero statusCode', () => {
		const mockEvent = createMockCloudEvent({
			data: {
				QBXML: {
					QBXMLMsgsRs: {
						'@requestID': '2',
						BillAddRs: {
							'@requestID': '2',
							'@statusCode': '3100',
							'@statusMessage': 'Vendor not found',
							'@statusSeverity': 'Error'
						}
					}
				}
			}
		});

		const decoded = decodeCloudEvent(mockEvent);

		expect(decoded.responseAttributes).toEqual({
			requestID: '2',
			statusCode: '3100',
			statusMessage: 'Vendor not found',
			statusSeverity: 'Error'
		});

		// Transaction details should be null for error responses
		expect(decoded.transactionDetails).toBeNull();
	});

	it('should extract transaction details from nested QBXML structure', () => {
		const mockEvent = createMockCloudEvent();
		const decoded = decodeCloudEvent(mockEvent);

		expect(decoded.transactionDetails).toEqual({
			TxnID: 'ABC-123',
			TxnNumber: '12345',
			TxnDate: '2025-11-08',
			RefNumber: 'BILL-001',
			IsPaid: 'false',
			OpenAmount: '1500.00',
			TimeCreated: '2025-11-08T10:00:00',
			TimeModified: '2025-11-08T10:30:00',
			VendorRef: {
				ListID: 'VENDOR-001',
				FullName: 'Test Vendor Inc.'
			},
			TermsRef: {
				ListID: 'TERMS-001',
				FullName: 'Net 30'
			}
		});
	});

	it('should handle array of transaction details (return first element)', () => {
		const mockEvent = createMockCloudEvent({
			data: {
				QBXML: {
					QBXMLMsgsRs: {
						'@requestID': '3',
						VendorQueryRs: {
							'@requestID': '3',
							'@statusCode': '0',
							'@statusMessage': 'Success',
							'@statusSeverity': 'Info',
							VendorRet: [
								{
									TxnID: 'V-001',
									TxnNumber: 'VENDOR-001',
									TxnDate: '2025-11-01',
									RefNumber: 'REF-001',
									IsPaid: 'true',
									OpenAmount: '0.00',
									TimeCreated: '2025-11-01T08:00:00',
									TimeModified: '2025-11-01T08:00:00',
									VendorRef: {
										ListID: 'VENDOR-001',
										FullName: 'Vendor One'
									},
									TermsRef: {
										ListID: 'TERMS-001',
										FullName: 'Net 15'
									}
								},
								{
									TxnID: 'V-002',
									TxnNumber: 'VENDOR-002',
									TxnDate: '2025-11-02',
									RefNumber: 'REF-002',
									IsPaid: 'false',
									OpenAmount: '500.00',
									TimeCreated: '2025-11-02T09:00:00',
									TimeModified: '2025-11-02T09:00:00',
									VendorRef: {
										ListID: 'VENDOR-002',
										FullName: 'Vendor Two'
									},
									TermsRef: {
										ListID: 'TERMS-002',
										FullName: 'Net 30'
									}
								}
							]
						}
					}
				}
			}
		});

		const decoded = decodeCloudEvent(mockEvent);

		// Should return first element of array
		expect(decoded.transactionDetails?.TxnID).toBe('V-001');
		expect(decoded.transactionDetails?.VendorRef.FullName).toBe('Vendor One');
	});

	it('should throw error for malformed CloudEvent (missing required fields)', () => {
		const invalidEvent = {
			specversion: '1.0',
			id: 'test-id',
			// Missing: source, type, time
			data: {}
		};

		expect(() => decodeCloudEvent(invalidEvent)).toThrow(
			/Invalid CloudEvent: missing required field/
		);
	});

	it('should throw error for null payload', () => {
		expect(() => decodeCloudEvent(null)).toThrow(
			'Invalid CloudEvent: payload must be an object'
		);
	});

	it('should throw error for non-object payload', () => {
		expect(() => decodeCloudEvent('not an object')).toThrow(
			'Invalid CloudEvent: payload must be an object'
		);
	});

	it('should handle missing QB response data gracefully (return null)', () => {
		const mockEvent = createMockCloudEvent({
			data: {
				// No QBXML field
				someOtherData: 'test'
			}
		});

		const decoded = decodeCloudEvent(mockEvent);

		expect(decoded.responseAttributes).toBeNull();
		expect(decoded.transactionDetails).toBeNull();
	});

	it('should handle missing QBXMLMsgsRs field', () => {
		const mockEvent = createMockCloudEvent({
			data: {
				QBXML: {
					// No QBXMLMsgsRs
				}
			}
		});

		const decoded = decodeCloudEvent(mockEvent);

		expect(decoded.responseAttributes).toBeNull();
		expect(decoded.transactionDetails).toBeNull();
	});

	it('should handle missing specific response type', () => {
		const mockEvent = createMockCloudEvent({
			data: {
				QBXML: {
					QBXMLMsgsRs: {
						'@requestID': '999'
						// No BillAddRs or other response type
					}
				}
			}
		});

		const decoded = decodeCloudEvent(mockEvent);

		expect(decoded.responseAttributes).toBeNull();
		expect(decoded.transactionDetails).toBeNull();
	});

	it('should handle response with missing Ret object', () => {
		const mockEvent = createMockCloudEvent({
			data: {
				QBXML: {
					QBXMLMsgsRs: {
						'@requestID': '4',
						BillAddRs: {
							'@requestID': '4',
							'@statusCode': '0',
							'@statusMessage': 'Success',
							'@statusSeverity': 'Info'
							// No BillRet
						}
					}
				}
			}
		});

		const decoded = decodeCloudEvent(mockEvent);

		// Should have response attributes but no transaction details
		expect(decoded.responseAttributes?.statusCode).toBe('0');
		expect(decoded.transactionDetails).toBeNull();
	});

	it('should provide defaults for missing transaction fields', () => {
		const mockEvent = createMockCloudEvent({
			data: {
				QBXML: {
					QBXMLMsgsRs: {
						'@requestID': '5',
						BillAddRs: {
							'@requestID': '5',
							'@statusCode': '0',
							'@statusMessage': 'Success',
							'@statusSeverity': 'Info',
							BillRet: {
								// Only minimal fields
								TxnID: 'MINIMAL-123'
								// All other fields missing
							}
						}
					}
				}
			}
		});

		const decoded = decodeCloudEvent(mockEvent);

		expect(decoded.transactionDetails).toEqual({
			TxnID: 'MINIMAL-123',
			TxnNumber: '',
			TxnDate: '',
			RefNumber: '',
			IsPaid: 'false',
			OpenAmount: '0.00',
			TimeCreated: '',
			TimeModified: '',
			VendorRef: {
				ListID: '',
				FullName: ''
			},
			TermsRef: {
				ListID: '',
				FullName: ''
			}
		});
	});
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('CloudEvent Integration Tests', () => {
	it('should handle encode → decode roundtrip successfully', () => {
		const originalData = {
			QBXML: {
				QBXMLMsgsRq: {
					BillAddRq: {
						VendorRef: { FullName: 'Integration Test Vendor' },
						TxnDate: '2025-11-08',
						AmountDue: '2500.00'
					}
				}
			}
		};

		// Encode
		const cloudEvent = encodeCloudEvent(
			'com.quickbooks.bill.add',
			'qb-chrome-extension',
			originalData
		);

		// Verify CloudEvent structure
		expect(cloudEvent.specversion).toBe('1.0');
		expect(cloudEvent.data).toEqual(originalData);

		// Simulate backend response (echo back with QB response wrapper)
		const backendResponse: CloudEvent = {
			...cloudEvent,
			type: 'com.quickbooks.bill.add.response',
			data: {
				QBXML: {
					QBXMLMsgsRs: {
						'@requestID': '999',
						BillAddRs: {
							'@requestID': '999',
							'@statusCode': '0',
							'@statusMessage': 'Bill added successfully',
							'@statusSeverity': 'Info',
							BillRet: {
								TxnID: 'INTEGRATION-TEST-001',
								TxnNumber: '99999',
								TxnDate: '2025-11-08',
								RefNumber: 'INT-TEST',
								IsPaid: 'false',
								OpenAmount: '2500.00',
								TimeCreated: '2025-11-08T12:00:00',
								TimeModified: '2025-11-08T12:00:00',
								VendorRef: {
									ListID: 'INT-VENDOR-001',
									FullName: 'Integration Test Vendor'
								},
								TermsRef: {
									ListID: 'INT-TERMS-001',
									FullName: 'Due on Receipt'
								}
							}
						}
					}
				}
			}
		};

		// Decode
		const decoded = decodeCloudEvent(backendResponse);

		// Verify decoded response
		expect(decoded.meta.id).toBe(cloudEvent.id);
		expect(decoded.responseAttributes?.statusCode).toBe('0');
		expect(decoded.responseAttributes?.statusMessage).toBe('Bill added successfully');
		expect(decoded.transactionDetails?.TxnID).toBe('INTEGRATION-TEST-001');
		expect(decoded.transactionDetails?.OpenAmount).toBe('2500.00');
		expect(decoded.transactionDetails?.VendorRef.FullName).toBe('Integration Test Vendor');
	});

	it('should handle error response in roundtrip', () => {
		const originalData = {
			QBXML: {
				QBXMLMsgsRq: {
					BillAddRq: {
						VendorRef: { FullName: 'Nonexistent Vendor' },
						TxnDate: '2025-11-08',
						AmountDue: '1000.00'
					}
				}
			}
		};

		// Encode
		const cloudEvent = encodeCloudEvent(
			'com.quickbooks.bill.add',
			'qb-chrome-extension',
			originalData
		);

		// Simulate error response from backend
		const errorResponse: CloudEvent = {
			...cloudEvent,
			type: 'com.quickbooks.bill.add.response',
			data: {
				QBXML: {
					QBXMLMsgsRs: {
						'@requestID': '888',
						BillAddRs: {
							'@requestID': '888',
							'@statusCode': '3100',
							'@statusMessage': 'There was an error when modifying a vendor.',
							'@statusSeverity': 'Error'
							// No BillRet on error
						}
					}
				}
			}
		};

		// Decode
		const decoded = decodeCloudEvent(errorResponse);

		// Verify error response
		expect(decoded.responseAttributes?.statusCode).toBe('3100');
		expect(decoded.responseAttributes?.statusSeverity).toBe('Error');
		expect(decoded.responseAttributes?.statusMessage).toContain('error');
		expect(decoded.transactionDetails).toBeNull();
	});
});
