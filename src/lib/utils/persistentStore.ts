/**
 * Persistent Store Utility
 *
 * Creates Svelte writable stores that automatically sync with Chrome Storage.
 * Provides bidirectional synchronization:
 * - Store updates → chrome.storage write
 * - chrome.storage.onChanged → Store updates
 *
 * @module persistentStore
 */

import { writable, type Writable } from 'svelte/store';

/**
 * Storage type for Chrome Extension storage
 */
export type StorageType = 'local' | 'sync';

/**
 * Creates a persistent store that syncs with Chrome Storage
 *
 * @template T - The type of data stored
 * @param key - The Chrome Storage key
 * @param initialValue - Default value if no stored data exists
 * @param storageType - Use 'local' (5MB limit) or 'sync' (100KB limit)
 * @returns A Svelte writable store with Chrome Storage persistence
 *
 * @example
 * ```typescript
 * interface Vendor {
 *   id: string;
 *   name: string;
 * }
 *
 * const vendors = persistentStore<Vendor[]>('vendors', [], 'local');
 *
 * // Subscribe to changes
 * vendors.subscribe(value => console.log('Vendors:', value));
 *
 * // Update store (automatically syncs to Chrome Storage)
 * vendors.update(v => [...v, { id: '1', name: 'Acme Corp' }]);
 * ```
 */
export function persistentStore<T>(
	key: string,
	initialValue: T,
	storageType: StorageType = 'local'
): Writable<T> {
	// Create the base writable store
	const store = writable<T>(initialValue);

	// Only run Chrome Storage code in browser (not during SSR)
	if (typeof chrome === 'undefined' || !chrome.storage) {
		return store;
	}

	// Get the correct storage area
	const storage = storageType === 'local' ? chrome.storage.local : chrome.storage.sync;

	// Track if we're initializing to prevent circular updates
	let isInitializing = true;

	// Initialize from Chrome Storage
	storage.get([key]).then((result) => {
		if (result[key] !== undefined) {
			store.set(result[key] as T);
		}
		isInitializing = false;
	});

	// Subscribe to store changes and sync to Chrome Storage
	store.subscribe((value) => {
		// Don't write during initialization
		if (isInitializing) return;

		// Write to Chrome Storage
		storage.set({ [key]: value }).catch((error) => {
			console.error(`Failed to persist ${key} to chrome.storage.${storageType}:`, error);
		});
	});

	// Listen for Chrome Storage changes from other sources
	// (e.g., service worker, other tabs, extension pages)
	chrome.storage.onChanged.addListener((changes, areaName) => {
		// Only respond to changes in our storage area
		if (areaName !== storageType) return;

		// Check if our key changed
		if (changes[key]) {
			const newValue = changes[key].newValue as T;

			// Update the store (don't trigger another Chrome Storage write)
			isInitializing = true;
			store.set(newValue);
			isInitializing = false;
		}
	});

	return store;
}
