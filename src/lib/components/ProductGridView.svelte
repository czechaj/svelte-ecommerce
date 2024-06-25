<script lang="ts">
	import type { Product } from '@prisma/client';
	import { ArrowRightCircle } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import ProductCard from './ProductCard.svelte';

	type ProductGridViewProps = {
		title: string;
		products: Product[];
	};

	let { products, title }: ProductGridViewProps = $props();
</script>

<div class="space-y-4">
	<div class="flex gap-4">
		<h2 class="text-3xl font-bold capitalize">{title}</h2>
		<Button class="space-x-2" size="sm" href="/products" variant="outline">
			<span> View All </span>
			<ArrowRightCircle />
		</Button>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each products as product}
			<ProductCard {...product} />
		{/each}
	</div>
</div>
