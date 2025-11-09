/**
 * Store Barrel Exports
 *
 * Central export point for all application stores.
 * Import stores from this file for cleaner imports:
 *
 * @example
 * ```typescript
 * import { vendorConfig, billCache, userPreferences } from '$lib/stores';
 * ```
 */

// Types
export type * from './types';

// Vendor stores
export { vendorConfig, vendorsByName, activeVendors, addVendor, updateVendor, deleteVendor } from './vendors';

// Preferences store
export { userPreferences, updatePreference, resetPreferences } from './preferences';

// Bill stores
export {
	billCache,
	filteredBillsByStatus,
	upcomingReminders,
	overdueBills,
	addBill,
	updateBill,
	deleteBill,
	markBillPaid
} from './bills';

// UI stores
export { backendURL, connectionStatus, currentRoute, testConnection, setBackendURL } from './ui';

// Storage monitoring
export { storageQuota, checkStorageQuota, cleanupOldData, monitorAndCleanup, initStorageMonitoring, QUOTA_LIMITS, THRESHOLDS } from '../utils/storageMonitor';

// Persistent store utility
export { persistentStore, type StorageType } from '../utils/persistentStore';
