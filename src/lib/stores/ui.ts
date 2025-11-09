/**
 * UI State Store
 *
 * Manages UI state including backend connection with Chrome Storage persistence.
 * Storage keys: 'backend-url', 'current-route' (chrome.storage.local)
 */

import { writable } from 'svelte/store';
import { persistentStore } from '../utils/persistentStore';
import type { UIState } from './types';

/**
 * Default UI state
 */
const defaultUIState: UIState = {
	backendURL: '',
	connectionStatus: 'disconnected',
	lastChecked: null
};

/**
 * Backend URL store
 * Persisted to chrome.storage.local with key 'backend-url'
 */
export const backendURL = persistentStore<string>('backend-url', '', 'local');

/**
 * Connection status store (not persisted - ephemeral state)
 */
export const connectionStatus = writable<'connected' | 'disconnected' | 'error'>('disconnected');

/**
 * Current route store (for Side Panel navigation)
 * Persisted to chrome.storage.local with key 'current-route'
 */
export const currentRoute = persistentStore<string>('current-route', '/', 'local');

/**
 * Helper: Test backend connection
 */
export async function testConnection(url: string): Promise<boolean> {
	try {
		const response = await fetch(`${url}/health`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const isConnected = response.ok;
		connectionStatus.set(isConnected ? 'connected' : 'error');
		return isConnected;
	} catch (error) {
		console.error('Connection test failed:', error);
		connectionStatus.set('error');
		return false;
	}
}

/**
 * Helper: Update backend URL and test connection
 */
export async function setBackendURL(url: string): Promise<boolean> {
	backendURL.set(url);

	if (!url) {
		connectionStatus.set('disconnected');
		return false;
	}

	return testConnection(url);
}
