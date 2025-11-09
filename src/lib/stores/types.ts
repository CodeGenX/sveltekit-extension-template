/**
 * Type definitions for application stores
 */

/**
 * Vendor configuration object
 */
export interface Vendor {
	/** Unique vendor identifier */
	id: string;
	/** Vendor display name */
	name: string;
	/** Default GL account for this vendor (optional) */
	defaultAccount?: string;
	/** Vendor is active/inactive */
	active: boolean;
	/** Creation timestamp */
	createdAt: number;
}

/**
 * User preferences for the extension
 */
export interface UserPreferences {
	/** Enable notification reminders */
	notificationsEnabled: boolean;
	/** Lead time for reminders (days before due date) */
	reminderLeadDays: number;
	/** Default view for bill list (all, pending, paid) */
	defaultView: 'all' | 'pending' | 'paid';
	/** Theme preference */
	theme: 'light' | 'dark' | 'system';
	/** Date format preference */
	dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

/**
 * Bill object stored in cache
 */
export interface Bill {
	/** Unique bill identifier */
	id: string;
	/** Vendor ID reference */
	vendorId: string;
	/** Vendor name (denormalized for display) */
	vendorName: string;
	/** Bill amount */
	amount: number;
	/** Due date (ISO 8601 string) */
	dueDate: string;
	/** Bill status */
	status: 'pending' | 'paid' | 'overdue';
	/** GL account code */
	account: string;
	/** Bill description/memo */
	description: string;
	/** Creation timestamp */
	createdAt: number;
	/** Last updated timestamp */
	updatedAt: number;
}

/**
 * UI state for backend connection
 */
export interface UIState {
	/** Backend API URL */
	backendURL: string;
	/** Connection status */
	connectionStatus: 'connected' | 'disconnected' | 'error';
	/** Last connection check timestamp */
	lastChecked: number | null;
}

/**
 * Storage quota status
 */
export interface StorageQuota {
	/** Bytes used */
	bytesInUse: number;
	/** Total quota in bytes (5MB for local) */
	quota: number;
	/** Percentage used (0-100) */
	percentUsed: number;
	/** Status level */
	status: 'ok' | 'warning' | 'critical';
}
