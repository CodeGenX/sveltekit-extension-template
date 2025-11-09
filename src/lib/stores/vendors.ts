/**
 * Vendor Store
 *
 * Manages vendor configuration with Chrome Storage persistence.
 * Storage key: 'vendors' (chrome.storage.local)
 */

import { derived, type Readable } from 'svelte/store';
import { persistentStore } from '../utils/persistentStore';
import type { Vendor } from './types';

/**
 * Vendor configuration store
 * Persisted to chrome.storage.local with key 'vendors'
 */
export const vendorConfig = persistentStore<Vendor[]>('vendors', [], 'local');

/**
 * Derived store: Vendors sorted alphabetically by name
 * Used for autocomplete and display lists
 */
export const vendorsByName: Readable<Vendor[]> = derived(vendorConfig, ($vendors) => {
	return [...$vendors].sort((a, b) => a.name.localeCompare(b.name));
});

/**
 * Derived store: Active vendors only
 */
export const activeVendors: Readable<Vendor[]> = derived(vendorConfig, ($vendors) => {
	return $vendors.filter((v) => v.active);
});

/**
 * Helper: Add a new vendor
 */
export function addVendor(name: string, defaultAccount?: string): void {
	vendorConfig.update((vendors) => [
		...vendors,
		{
			id: crypto.randomUUID(),
			name,
			defaultAccount,
			active: true,
			createdAt: Date.now()
		}
	]);
}

/**
 * Helper: Update an existing vendor
 */
export function updateVendor(id: string, updates: Partial<Omit<Vendor, 'id'>>): void {
	vendorConfig.update((vendors) =>
		vendors.map((v) => (v.id === id ? { ...v, ...updates } : v))
	);
}

/**
 * Helper: Delete a vendor (marks as inactive)
 */
export function deleteVendor(id: string): void {
	vendorConfig.update((vendors) => vendors.map((v) => (v.id === id ? { ...v, active: false } : v)));
}
