<script lang="ts">
	// No imports needed - using native HTML elements with Tailwind styling
</script>

<div class="p-8 space-y-12 overflow-y-auto h-full">
	<header class="mb-8">
		<h1 class="text-4xl font-bold text-primary-600 mb-2">Design System Showcase</h1>
		<p class="text-lg text-secondary-600">
			Testing Skeleton UI 4.2.2 with Tailwind CSS v4 design tokens
		</p>
	</header>

	<!-- Typography Section -->
	<section class="space-y-4">
		<h2 class="text-3xl font-semibold text-secondary-900 border-b pb-2">Typography</h2>

		<div class="space-y-2">
			<p class="text-xs">Text XS (12px) - Inter font family with system fallback</p>
			<p class="text-sm">Text SM (14px) - Inter font family with system fallback</p>
			<p class="text-base">Text Base (16px) - Inter font family with system fallback</p>
			<p class="text-lg">Text LG (18px) - Inter font family with system fallback</p>
			<p class="text-xl">Text XL (20px) - Inter font family with system fallback</p>
			<p class="text-2xl">Text 2XL (24px) - Inter font family</p>
			<p class="text-3xl">Text 3XL (30px) - Inter font</p>
			<p class="text-4xl">Text 4XL (36px)</p>
		</div>

		<div class="mt-4 p-4 bg-secondary-50 rounded-lg">
			<p class="text-sm text-secondary-600">
				Font Family:
				<span class="font-mono">
					'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu,
					Cantarell, sans-serif
				</span>
			</p>
			<p class="text-sm text-secondary-600 mt-1">Base Font Size: 16px | Line Height: 1.5</p>
		</div>
	</section>

	<!-- Color Palette Section -->
	<section class="space-y-4">
		<h2 class="text-3xl font-semibold text-secondary-900 border-b pb-2">Color Palette</h2>

		<div>
			<h3 class="text-xl font-medium mb-3">Primary (Blue)</h3>
			<div class="flex gap-2 flex-wrap">
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-50 rounded border"></div>
					<span class="text-xs mt-1">50</span>
				</div>
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-100 rounded border"></div>
					<span class="text-xs mt-1">100</span>
				</div>
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-200 rounded border"></div>
					<span class="text-xs mt-1">200</span>
				</div>
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-300 rounded border"></div>
					<span class="text-xs mt-1">300</span>
				</div>
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-400 rounded border"></div>
					<span class="text-xs mt-1">400</span>
				</div>
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-500 rounded border"></div>
					<span class="text-xs mt-1">500</span>
				</div>
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-600 rounded border"></div>
					<span class="text-xs mt-1">600</span>
				</div>
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-700 rounded border"></div>
					<span class="text-xs mt-1">700</span>
				</div>
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-800 rounded border"></div>
					<span class="text-xs mt-1">800</span>
				</div>
				<div class="flex flex-col items-center">
					<div class="w-16 h-16 bg-primary-900 rounded border"></div>
					<span class="text-xs mt-1">900</span>
				</div>
			</div>
		</div>

		<div>
			<h3 class="text-xl font-medium mb-3">Success (Green)</h3>
			<div class="flex gap-2 flex-wrap">
				{#each [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as shade}
					<div class="flex flex-col items-center">
						<div class="w-16 h-16 bg-success-{shade} rounded border"></div>
						<span class="text-xs mt-1">{shade}</span>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<h3 class="text-xl font-medium mb-3">Error (Red)</h3>
			<div class="flex gap-2 flex-wrap">
				{#each [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as shade}
					<div class="flex flex-col items-center">
						<div class="w-16 h-16 bg-error-{shade} rounded border"></div>
						<span class="text-xs mt-1">{shade}</span>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<h3 class="text-xl font-medium mb-3">Secondary (Slate/Gray)</h3>
			<div class="flex gap-2 flex-wrap">
				{#each [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as shade}
					<div class="flex flex-col items-center">
						<div class="w-16 h-16 bg-secondary-{shade} rounded border"></div>
						<span class="text-xs mt-1">{shade}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Button Components -->
	<section class="space-y-4">
		<h2 class="text-3xl font-semibold text-secondary-900 border-b pb-2">Button Components</h2>

		<div class="space-y-6">
			<div>
				<h3 class="text-lg font-medium mb-3">Primary Buttons</h3>
				<div class="flex gap-4 flex-wrap items-center">
					<button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
						Primary Filled
					</button>
					<button class="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">
						Primary Ghost
					</button>
					<button class="px-4 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">
						Primary Outlined
					</button>
					<button disabled class="px-4 py-2 bg-secondary-300 text-secondary-500 rounded-lg font-medium cursor-not-allowed">
						Disabled
					</button>
				</div>
			</div>

			<div>
				<h3 class="text-lg font-medium mb-3">Success Buttons</h3>
				<div class="flex gap-4 flex-wrap items-center">
					<button class="px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg font-medium transition-colors">
						Success Filled
					</button>
					<button class="px-4 py-2 text-success-600 hover:bg-success-50 rounded-lg font-medium transition-colors">
						Success Ghost
					</button>
					<button class="px-4 py-2 border-2 border-success-600 text-success-600 hover:bg-success-50 rounded-lg font-medium transition-colors">
						Success Outlined
					</button>
				</div>
			</div>

			<div>
				<h3 class="text-lg font-medium mb-3">Error Buttons</h3>
				<div class="flex gap-4 flex-wrap items-center">
					<button class="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg font-medium transition-colors">
						Error Filled
					</button>
					<button class="px-4 py-2 text-error-600 hover:bg-error-50 rounded-lg font-medium transition-colors">
						Error Ghost
					</button>
					<button class="px-4 py-2 border-2 border-error-600 text-error-600 hover:bg-error-50 rounded-lg font-medium transition-colors">
						Error Outlined
					</button>
				</div>
			</div>

			<div>
				<h3 class="text-lg font-medium mb-3">Secondary Buttons</h3>
				<div class="flex gap-4 flex-wrap items-center">
					<button class="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors">
						Secondary Filled
					</button>
					<button class="px-4 py-2 text-secondary-600 hover:bg-secondary-50 rounded-lg font-medium transition-colors">
						Secondary Ghost
					</button>
					<button class="px-4 py-2 border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-50 rounded-lg font-medium transition-colors">
						Secondary Outlined
					</button>
				</div>
			</div>

			<div>
				<h3 class="text-lg font-medium mb-3">Button Sizes</h3>
				<div class="flex gap-4 flex-wrap items-center">
					<button class="px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
						Small Button
					</button>
					<button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
						Medium Button
					</button>
					<button class="px-6 py-3 text-lg bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
						Large Button
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Card Components -->
	<section class="space-y-4">
		<h2 class="text-3xl font-semibold text-secondary-900 border-b pb-2">Card Components</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div class="card bg-white p-6 rounded-lg shadow-md border border-secondary-200">
				<h3 class="text-xl font-semibold mb-2">Basic Card</h3>
				<p class="text-secondary-600">
					A simple card with default styling using design tokens. Border radius: 8px (rounded-lg).
				</p>
			</div>

			<div class="card bg-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
				<h3 class="text-xl font-semibold text-primary-700 mb-2">Primary Card</h3>
				<p class="text-primary-600">
					Card with primary color background and border from design token palette.
				</p>
			</div>

			<div class="card bg-success-50 p-6 rounded-lg shadow-md border border-success-200">
				<h3 class="text-xl font-semibold text-success-700 mb-2">Success Card</h3>
				<p class="text-success-600">Card with success color background from design tokens.</p>
			</div>

			<div class="card bg-error-50 p-6 rounded-lg shadow-md border border-error-200">
				<h3 class="text-xl font-semibold text-error-700 mb-2">Error Card</h3>
				<p class="text-error-600">Card with error color background from design tokens.</p>
			</div>

			<div class="card bg-white p-6 rounded-xl shadow-lg border-2 border-secondary-300">
				<h3 class="text-xl font-semibold mb-2">Custom Radius Card</h3>
				<p class="text-secondary-600">
					Using rounded-xl (12px) with enhanced shadow and thicker border.
				</p>
			</div>

			<div class="card bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-2xl shadow-xl text-white">
				<h3 class="text-xl font-semibold mb-2">Gradient Card</h3>
				<p>Using rounded-2xl (16px) with gradient background using primary tokens.</p>
			</div>
		</div>
	</section>

	<!-- Form Components -->
	<section class="space-y-4">
		<h2 class="text-3xl font-semibold text-secondary-900 border-b pb-2">Form Components</h2>

		<div class="max-w-2xl space-y-6">
			<div>
				<label for="text-input" class="block text-sm font-medium text-secondary-700 mb-1">
					Text Input
				</label>
				<input
					id="text-input"
					type="text"
					placeholder="Enter text here..."
					class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
				/>
			</div>

			<div>
				<label for="email-input" class="block text-sm font-medium text-secondary-700 mb-1">
					Email Input
				</label>
				<input
					id="email-input"
					type="email"
					placeholder="email@example.com"
					class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
				/>
			</div>

			<div>
				<label for="select-input" class="block text-sm font-medium text-secondary-700 mb-1">
					Select Dropdown
				</label>
				<select
					id="select-input"
					class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
				>
					<option>Option 1</option>
					<option>Option 2</option>
					<option>Option 3</option>
				</select>
			</div>

			<div>
				<label for="textarea-input" class="block text-sm font-medium text-secondary-700 mb-1">
					Textarea
				</label>
				<textarea
					id="textarea-input"
					rows="4"
					placeholder="Enter longer text here..."
					class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
				></textarea>
			</div>

			<div class="space-y-3">
				<div class="flex items-center">
					<input
						id="checkbox-1"
						type="checkbox"
						class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-2 focus:ring-primary-500"
					/>
					<label for="checkbox-1" class="ml-2 text-sm text-secondary-700">
						Checkbox Option 1
					</label>
				</div>
				<div class="flex items-center">
					<input
						id="checkbox-2"
						type="checkbox"
						checked
						class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-2 focus:ring-primary-500"
					/>
					<label for="checkbox-2" class="ml-2 text-sm text-secondary-700">
						Checkbox Option 2 (checked)
					</label>
				</div>
			</div>

			<div class="space-y-3">
				<div class="flex items-center">
					<input
						id="radio-1"
						type="radio"
						name="radio-group"
						class="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-2 focus:ring-primary-500"
					/>
					<label for="radio-1" class="ml-2 text-sm text-secondary-700">Radio Option 1</label>
				</div>
				<div class="flex items-center">
					<input
						id="radio-2"
						type="radio"
						name="radio-group"
						checked
						class="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-2 focus:ring-primary-500"
					/>
					<label for="radio-2" class="ml-2 text-sm text-secondary-700">
						Radio Option 2 (checked)
					</label>
				</div>
			</div>
		</div>
	</section>

	<!-- Spacing & Border Radius -->
	<section class="space-y-4">
		<h2 class="text-3xl font-semibold text-secondary-900 border-b pb-2">Spacing & Border Radius</h2>

		<div>
			<h3 class="text-lg font-medium mb-3">Spacing Scale (4px base unit)</h3>
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<div class="w-4 h-4 bg-primary-500"></div>
					<span class="text-sm">p-1 (4px)</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 bg-primary-500"></div>
					<span class="text-sm">p-2 (8px)</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-12 h-12 bg-primary-500"></div>
					<span class="text-sm">p-3 (12px)</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-16 h-16 bg-primary-500"></div>
					<span class="text-sm">p-4 (16px)</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-20 h-20 bg-primary-500"></div>
					<span class="text-sm">p-5 (20px)</span>
				</div>
			</div>
		</div>

		<div>
			<h3 class="text-lg font-medium mb-3">Border Radius Scale</h3>
			<div class="flex gap-4 flex-wrap">
				<div class="text-center">
					<div class="w-24 h-24 bg-primary-500 rounded-sm"></div>
					<span class="text-xs mt-1 block">sm (4px)</span>
				</div>
				<div class="text-center">
					<div class="w-24 h-24 bg-primary-500 rounded"></div>
					<span class="text-xs mt-1 block">default (8px)</span>
				</div>
				<div class="text-center">
					<div class="w-24 h-24 bg-primary-500 rounded-lg"></div>
					<span class="text-xs mt-1 block">lg (8px)</span>
				</div>
				<div class="text-center">
					<div class="w-24 h-24 bg-primary-500 rounded-xl"></div>
					<span class="text-xs mt-1 block">xl (12px)</span>
				</div>
				<div class="text-center">
					<div class="w-24 h-24 bg-primary-500 rounded-2xl"></div>
					<span class="text-xs mt-1 block">2xl (16px)</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Dark Mode Preview -->
	<section class="space-y-4">
		<h2 class="text-3xl font-semibold text-secondary-900 border-b pb-2">
			Dark Mode Infrastructure
		</h2>

		<div class="p-6 bg-secondary-100 rounded-lg">
			<p class="text-sm text-secondary-700 mb-4">
				<strong>Note:</strong> Dark mode infrastructure is configured but not yet enabled. Dark mode
				toggle will be implemented in Story 1.3.5 (User Preferences Panel).
			</p>

			<div class="space-y-2 text-sm">
				<p>
					<strong>Strategy:</strong> Class-based (@custom-variant dark)
				</p>
				<p>
					<strong>Dark Mode Colors Defined:</strong>
				</p>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>Background: #1a1a1a (primary), #2a2a2a (secondary), #3a3a3a (tertiary)</li>
					<li>Text: #f5f5f5 (primary), #e5e5e5 (secondary), #d5d5d5 (tertiary)</li>
					<li>Primary/Secondary colors: Slightly brighter variants for dark mode</li>
				</ul>
				<p class="mt-2">
					<strong>Activation:</strong> Add <code class="bg-white px-1 rounded">.dark</code> class to
					<code class="bg-white px-1 rounded">&lt;html&gt;</code> element
				</p>
			</div>
		</div>
	</section>
</div>
