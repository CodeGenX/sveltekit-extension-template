/**
 * Bill Cache Store
 *
 * Manages cached bills with Chrome Storage persistence.
 * Storage key: 'bill-cache' (chrome.storage.local)
 */

import { derived, type Readable } from 'svelte/store';
import { persistentStore } from '../utils/persistentStore';
import { userPreferences } from './preferences';
import type { Bill } from './types';

/**
 * Bill cache store
 * Persisted to chrome.storage.local with key 'bill-cache'
 */
export const billCache = persistentStore<Bill[]>('bill-cache', [], 'local');

/**
 * Derived store: Filtered bills by status
 */
export function filteredBillsByStatus(status?: 'pending' | 'paid' | 'overdue'): Readable<Bill[]> {
	return derived(billCache, ($bills) => {
		if (!status) return $bills;
		return $bills.filter((bill) => bill.status === status);
	});
}

/**
 * Derived store: Upcoming bills that need reminders
 * Based on user's reminder lead days preference
 */
export const upcomingReminders: Readable<Bill[]> = derived(
	[billCache, userPreferences],
	([$bills, $prefs]) => {
		const now = Date.now();
		const leadTimeMs = $prefs.reminderLeadDays * 24 * 60 * 60 * 1000; // days to milliseconds

		return $bills.filter((bill) => {
			// Only pending bills
			if (bill.status !== 'pending') return false;

			const dueDate = new Date(bill.dueDate).getTime();
			const timeUntilDue = dueDate - now;

			// Show if due within lead time but not overdue
			return timeUntilDue > 0 && timeUntilDue <= leadTimeMs;
		});
	}
);

/**
 * Derived store: Overdue bills
 */
export const overdueBills: Readable<Bill[]> = derived(billCache, ($bills) => {
	const now = Date.now();
	return $bills.filter((bill) => {
		if (bill.status !== 'pending') return false;
		const dueDate = new Date(bill.dueDate).getTime();
		return dueDate < now;
	});
});

/**
 * Helper: Add a new bill
 */
export function addBill(bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): void {
	const now = Date.now();
	billCache.update((bills) => [
		...bills,
		{
			...bill,
			id: crypto.randomUUID(),
			createdAt: now,
			updatedAt: now
		}
	]);
}

/**
 * Helper: Update an existing bill
 */
export function updateBill(id: string, updates: Partial<Omit<Bill, 'id'>>): void {
	billCache.update((bills) =>
		bills.map((b) =>
			b.id === id
				? {
						...b,
						...updates,
						updatedAt: Date.now()
					}
				: b
		)
	);
}

/**
 * Helper: Delete a bill
 */
export function deleteBill(id: string): void {
	billCache.update((bills) => bills.filter((b) => b.id !== id));
}

/**
 * Helper: Mark bill as paid
 */
export function markBillPaid(id: string): void {
	updateBill(id, { status: 'paid' });
}
