<div class="w-full min-h-full p-8">
	<div class="max-w-2xl mx-auto space-y-8 pb-8">
		<!-- Header -->
		<header class="text-center space-y-4">
			<h1 class="text-4xl font-bold text-primary-600">QB Chrome Extension</h1>
			<p class="text-lg text-secondary-600">QuickBooks Desktop Integration</p>
			<p class="text-sm text-secondary-500">Version 2.0.0 - SvelteKit Migration</p>
		</header>

		<!-- Navigation Cards -->
		<div class="grid grid-cols-1 gap-6">
			<!-- Test Pages Section -->
			<section class="space-y-4">
				<h2 class="text-2xl font-semibold text-secondary-900 border-b pb-2">
					Test & Development Pages
				</h2>

				<!-- Design System Test -->
				<a
					href="/test-components"
					class="block p-6 bg-white rounded-lg shadow-md border-2 border-primary-200 hover:border-primary-400 hover:shadow-lg transition-all"
				>
					<h3 class="text-xl font-semibold text-primary-700 mb-2">
						🎨 Design System Showcase
					</h3>
					<p class="text-secondary-600 text-sm mb-3">
						Story 1.1.3: Skeleton UI Design System with Tailwind CSS v4
					</p>
					<ul class="text-sm text-secondary-500 space-y-1 list-disc list-inside">
						<li>Color palettes (Primary, Secondary, Success, Error)</li>
						<li>Typography scale with Inter font</li>
						<li>Button variants and form components</li>
						<li>Dark mode infrastructure</li>
					</ul>
					<div class="mt-4 text-primary-600 font-medium text-sm">
						Click to view →
					</div>
				</a>

				<!-- Stores Test -->
				<a
					href="/test-stores"
					class="block p-6 bg-white rounded-lg shadow-md border-2 border-success-200 hover:border-success-400 hover:shadow-lg transition-all"
				>
					<h3 class="text-xl font-semibold text-success-700 mb-2">
						📦 Store Reactivity Tests
					</h3>
					<p class="text-secondary-600 text-sm mb-3">
						Story 1.1.4: Svelte Stores with Chrome Storage Persistence
					</p>
					<ul class="text-sm text-secondary-500 space-y-1 list-disc list-inside">
						<li>Vendor store with Chrome Storage sync</li>
						<li>Bill cache with derived stores</li>
						<li>User preferences (cross-device sync)</li>
						<li>Storage quota monitoring</li>
					</ul>
					<div class="mt-4 text-success-600 font-medium text-sm">
						Click to view →
					</div>
				</a>
			</section>

			<!-- Future Features Section -->
			<section class="space-y-4">
				<h2 class="text-2xl font-semibold text-secondary-900 border-b pb-2">
					Coming Soon
				</h2>

				<div class="p-6 bg-secondary-50 rounded-lg border border-secondary-200">
					<h3 class="text-xl font-semibold text-secondary-700 mb-2">
						🚀 Phase 1 Features (Epic 1.1)
					</h3>
					<ul class="text-sm text-secondary-600 space-y-1 list-disc list-inside">
						<li>App shell layout with navigation</li>
						<li>Settings & configuration UI</li>
						<li>Bill entry forms</li>
						<li>Payment workflows</li>
						<li>Transaction history</li>
					</ul>
				</div>
			</section>

			<!-- Build Info -->
			<section class="text-center text-xs text-secondary-400 space-y-1">
				<p>Built with SvelteKit + Skeleton UI + Tailwind CSS v4</p>
				<p>Chrome Extension Manifest v3 | Side Panel API</p>
			</section>
		</div>
	</div>
</div>
