/**
 * User Preferences Store
 *
 * Manages user preferences with Chrome Storage sync.
 * Storage key: 'user-preferences' (chrome.storage.sync)
 */

import { persistentStore } from '../utils/persistentStore';
import type { UserPreferences } from './types';

/**
 * Default user preferences
 */
const defaultPreferences: UserPreferences = {
	notificationsEnabled: true,
	reminderLeadDays: 3,
	defaultView: 'all',
	theme: 'system',
	dateFormat: 'MM/DD/YYYY'
};

/**
 * User preferences store
 * Persisted to chrome.storage.sync with key 'user-preferences'
 * Syncs across devices logged into the same Chrome account
 */
export const userPreferences = persistentStore<UserPreferences>(
	'user-preferences',
	defaultPreferences,
	'sync'
);

/**
 * Helper: Update a single preference
 */
export function updatePreference<K extends keyof UserPreferences>(
	key: K,
	value: UserPreferences[K]
): void {
	userPreferences.update((prefs) => ({
		...prefs,
		[key]: value
	}));
}

/**
 * Helper: Reset to default preferences
 */
export function resetPreferences(): void {
	userPreferences.set(defaultPreferences);
}
