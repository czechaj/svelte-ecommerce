<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex items-center justify-center gap-7 bg-primary px-8 text-primary-foreground">
	{@render children()}
</div>

<style>
</style>
