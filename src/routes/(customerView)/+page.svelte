<script lang="ts">
	import ProductGridView from '$lib/components/ProductGridView.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<div class="space-y-12">
	<ProductGridView products={data.mostPopularProducts} title="Most Popular" />
	<ProductGridView products={data.newestProducts} title="Newest" />
</div>
