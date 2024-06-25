<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatCurrency } from '$lib/utils';
	import type { Product } from '@prisma/client';
	import Button from './ui/button/button.svelte';

	let { priceInCents, imagePath, description, name, id }: Product = $props();
</script>

<div class="col-span-1">
	<Card.Root>
		<img src={imagePath} alt={name} class="aspect-video h-auto w-full object-cover" />
		<Card.Header>
			<Card.Title>{name}</Card.Title>
			<Card.Description>{formatCurrency(priceInCents / 100)}</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="line-clamp-4">{description}</p>
		</Card.Content>
		<Card.Footer>
			<Button class="w-full" size="lg" href={`/products/${id}/purchase`}>Purchase</Button>
		</Card.Footer>
	</Card.Root>
</div>
