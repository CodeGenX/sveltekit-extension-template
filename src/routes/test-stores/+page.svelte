<script lang="ts">
	import {
		vendorConfig,
		vendorsByName,
		billCache,
		userPreferences,
		backendURL,
		connectionStatus,
		storageQuota,
		addVendor,
		addBill,
		updatePreference,
		checkStorageQuota
	} from '$lib/stores';

	// Reactive subscriptions using $ syntax
	$: vendors = $vendorConfig;
	$: sortedVendors = $vendorsByName;
	$: bills = $billCache;
	$: prefs = $userPreferences;
	$: url = $backendURL;
	$: status = $connectionStatus;
	$: quota = $storageQuota;

	// Test functions
	function testAddVendor() {
		addVendor(`Test Vendor ${Date.now()}`, 'GL-1000');
	}

	function testAddBill() {
		if (vendors.length === 0) {
			alert('Add a vendor first!');
			return;
		}
		const vendor = vendors[0];
		addBill({
			vendorId: vendor.id,
			vendorName: vendor.name,
			amount: Math.random() * 1000,
			dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
			status: 'pending',
			account: 'GL-5000',
			description: `Test bill ${Date.now()}`
		});
	}

	function testUpdatePreference() {
		const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
		const currentIndex = themes.indexOf(prefs.theme);
		const nextTheme = themes[(currentIndex + 1) % themes.length];
		updatePreference('theme', nextTheme);
	}

	function testBackendURL() {
		const testURL = 'http://localhost:3000';
		backendURL.set(testURL);
	}

	async function testQuotaCheck() {
		await checkStorageQuota();
	}
</script>

<div class="p-8 max-w-6xl mx-auto space-y-8">
	<header>
		<h1 class="text-4xl font-bold text-primary-600 mb-2">Store Reactivity Test</h1>
		<p class="text-secondary-600">Testing Svelte stores with Chrome Storage persistence</p>
	</header>

	<!-- Vendor Store Tests -->
	<section class="card bg-white p-6 rounded-lg shadow-md border border-secondary-200">
		<h2 class="text-2xl font-semibold mb-4">Vendor Store</h2>
		<div class="space-y-4">
			<button
				onclick={testAddVendor}
				class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
			>
				Add Test Vendor
			</button>

			<div class="mt-4">
				<h3 class="font-medium mb-2">Vendors ({vendors.length}):</h3>
				<ul class="space-y-1">
					{#each sortedVendors as vendor}
						<li class="text-sm">
							{vendor.name} - {vendor.defaultAccount || 'No default account'}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- Bill Store Tests -->
	<section class="card bg-white p-6 rounded-lg shadow-md border border-secondary-200">
		<h2 class="text-2xl font-semibold mb-4">Bill Store</h2>
		<div class="space-y-4">
			<button
				onclick={testAddBill}
				class="px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg font-medium transition-colors"
			>
				Add Test Bill
			</button>

			<div class="mt-4">
				<h3 class="font-medium mb-2">Bills ({bills.length}):</h3>
				<ul class="space-y-1">
					{#each bills.slice(0, 5) as bill}
						<li class="text-sm">
							{bill.vendorName} - ${bill.amount.toFixed(2)} - {bill.status}
						</li>
					{/each}
				</ul>
				{#if bills.length > 5}
					<p class="text-xs text-secondary-500 mt-2">... and {bills.length - 5} more</p>
				{/if}
			</div>
		</div>
	</section>

	<!-- Preferences Store Tests -->
	<section class="card bg-white p-6 rounded-lg shadow-md border border-secondary-200">
		<h2 class="text-2xl font-semibold mb-4">User Preferences</h2>
		<div class="space-y-4">
			<button
				onclick={testUpdatePreference}
				class="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors"
			>
				Toggle Theme
			</button>

			<div class="mt-4 space-y-2 text-sm">
				<p><strong>Theme:</strong> {prefs.theme}</p>
				<p><strong>Notifications:</strong> {prefs.notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
				<p><strong>Reminder Lead Days:</strong> {prefs.reminderLeadDays}</p>
				<p><strong>Default View:</strong> {prefs.defaultView}</p>
				<p><strong>Date Format:</strong> {prefs.dateFormat}</p>
			</div>
		</div>
	</section>

	<!-- Backend URL Tests -->
	<section class="card bg-white p-6 rounded-lg shadow-md border border-secondary-200">
		<h2 class="text-2xl font-semibold mb-4">Backend URL & Connection</h2>
		<div class="space-y-4">
			<button
				onclick={testBackendURL}
				class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
			>
				Set Test URL
			</button>

			<div class="mt-4 space-y-2 text-sm">
				<p><strong>Backend URL:</strong> {url || 'Not set'}</p>
				<p>
					<strong>Status:</strong>
					<span
						class:text-success-600={status === 'connected'}
						class:text-error-600={status === 'error'}
						class:text-secondary-600={status === 'disconnected'}
					>
						{status}
					</span>
				</p>
			</div>
		</div>
	</section>

	<!-- Storage Quota Tests -->
	<section class="card bg-white p-6 rounded-lg shadow-md border border-secondary-200">
		<h2 class="text-2xl font-semibold mb-4">Storage Quota</h2>
		<div class="space-y-4">
			<button
				onclick={testQuotaCheck}
				class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
			>
				Check Quota
			</button>

			<div class="mt-4 space-y-2 text-sm">
				<p><strong>Bytes Used:</strong> {quota.bytesInUse.toLocaleString()} bytes</p>
				<p><strong>Quota:</strong> {quota.quota.toLocaleString()} bytes (5MB)</p>
				<p><strong>Percent Used:</strong> {quota.percentUsed.toFixed(2)}%</p>
				<p>
					<strong>Status:</strong>
					<span
						class:text-success-600={quota.status === 'ok'}
						class:text-error-600={quota.status === 'critical'}
						class:text-secondary-600={quota.status === 'warning'}
					>
						{quota.status.toUpperCase()}
					</span>
				</p>
			</div>
		</div>
	</section>

	<!-- Reactivity Verification -->
	<section class="card bg-success-50 p-6 rounded-lg shadow-md border border-success-200">
		<h2 class="text-2xl font-semibold text-success-700 mb-4">✓ Reactivity Working</h2>
		<p class="text-success-600 text-sm">
			All values above update automatically when stores change. Check Chrome DevTools →
			Application → Storage → Extension Storage to verify Chrome Storage sync.
		</p>
	</section>
</div>
