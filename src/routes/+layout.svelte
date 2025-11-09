<script lang="ts">
	// Most of your app wide CSS should be put in this file
	import '../app.css';

	let { children } = $props();
</script>

<!-- App Shell -->
<div class="h-full flex flex-col">
	<!-- Page Route Content -->
	<div class="flex-1 overflow-auto">
		{@render children?.()}
	</div>
</div>
