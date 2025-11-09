/**
 * Chrome Storage Quota Monitoring
 *
 * Monitors Chrome Storage usage and implements cleanup strategies.
 * - chrome.storage.local: 5MB limit (5242880 bytes)
 * - chrome.storage.sync: 100KB limit (102400 bytes)
 */

import { writable } from 'svelte/store';
import { billCache } from '../stores/bills';
import type { StorageQuota } from '../stores/types';

/**
 * Storage quota limits in bytes
 */
export const QUOTA_LIMITS = {
	local: 5242880, // 5MB
	sync: 102400 // 100KB
} as const;

/**
 * Warning thresholds (percentage)
 */
export const THRESHOLDS = {
	ok: 80, // Below 80% = OK
	warning: 90, // 80-90% = Warning
	critical: 95 // Above 90% = Critical
} as const;

/**
 * Storage quota status store
 */
export const storageQuota = writable<StorageQuota>({
	bytesInUse: 0,
	quota: QUOTA_LIMITS.local,
	percentUsed: 0,
	status: 'ok'
});

/**
 * Check current storage quota usage
 * @returns Current quota status
 */
export async function checkStorageQuota(): Promise<StorageQuota> {
	// Guard against SSR
	if (typeof chrome === 'undefined' || !chrome.storage) {
		const defaultQuota: StorageQuota = {
			bytesInUse: 0,
			quota: QUOTA_LIMITS.local,
			percentUsed: 0,
			status: 'ok'
		};
		storageQuota.set(defaultQuota);
		return defaultQuota;
	}

	try {
		const bytesInUse = await chrome.storage.local.getBytesInUse();
		const quota = QUOTA_LIMITS.local;
		const percentUsed = (bytesInUse / quota) * 100;

		let status: 'ok' | 'warning' | 'critical' = 'ok';
		if (percentUsed >= THRESHOLDS.critical) {
			status = 'critical';
		} else if (percentUsed >= THRESHOLDS.warning) {
			status = 'warning';
		}

		const quotaStatus: StorageQuota = {
			bytesInUse,
			quota,
			percentUsed,
			status
		};

		// Update store
		storageQuota.set(quotaStatus);

		return quotaStatus;
	} catch (error) {
		console.error('Failed to check storage quota:', error);
		throw error;
	}
}

/**
 * Clean up old bills to free storage space
 * Removes oldest bills first, keeping at least 10 most recent
 * @param targetPercentage - Target usage percentage after cleanup (default: 70%)
 */
export async function cleanupOldData(targetPercentage: number = 70): Promise<number> {
	const quota = await checkStorageQuota();

	// Don't cleanup if below target
	if (quota.percentUsed <= targetPercentage) {
		return 0;
	}

	// Calculate how many bytes to free
	const targetBytes = (targetPercentage / 100) * quota.quota;
	const bytesToFree = quota.bytesInUse - targetBytes;

	let billsToRemove = 0;
	let estimatedBytesFreed = 0;

	// Get current bills
	return new Promise<number>((resolve) => {
		billCache.subscribe((bills) => {
			// Sort bills by creation date (oldest first)
			const sortedBills = [...bills].sort((a, b) => a.createdAt - b.createdAt);

			// Keep at least 10 most recent bills
			const minBillsToKeep = 10;
			const maxBillsToRemove = Math.max(0, sortedBills.length - minBillsToKeep);

			// Estimate bytes per bill (rough average)
			const avgBytesPerBill = Math.ceil(quota.bytesInUse / sortedBills.length) || 500;

			// Calculate how many bills to remove
			billsToRemove = Math.min(maxBillsToRemove, Math.ceil(bytesToFree / avgBytesPerBill));

			if (billsToRemove > 0) {
				// Remove oldest bills
				const billsToKeep = sortedBills.slice(billsToRemove);
				billCache.set(billsToKeep);

				estimatedBytesFreed = billsToRemove * avgBytesPerBill;

				console.log(
					`Cleaned up ${billsToRemove} old bills, freed ~${estimatedBytesFreed} bytes`
				);
			}

			resolve(billsToRemove);
		})();
	});
}

/**
 * Monitor storage quota and trigger cleanup if needed
 * Should be called periodically (e.g., on app startup, after data writes)
 */
export async function monitorAndCleanup(): Promise<void> {
	const quota = await checkStorageQuota();

	if (quota.status === 'critical') {
		console.warn(
			`Storage quota critical: ${quota.percentUsed.toFixed(1)}% used. Running cleanup...`
		);
		await cleanupOldData(70);
		await checkStorageQuota(); // Recheck after cleanup
	} else if (quota.status === 'warning') {
		console.warn(`Storage quota warning: ${quota.percentUsed.toFixed(1)}% used`);
	}
}

/**
 * Initialize storage monitoring
 * Sets up periodic quota checks
 */
export function initStorageMonitoring(): void {
	// Guard against SSR
	if (typeof chrome === 'undefined' || !chrome.storage) {
		return;
	}

	// Check quota on initialization
	checkStorageQuota();

	// Check quota every 5 minutes
	setInterval(checkStorageQuota, 5 * 60 * 1000);

	// Listen for storage changes and check quota
	chrome.storage.onChanged.addListener(() => {
		checkStorageQuota();
	});
}
