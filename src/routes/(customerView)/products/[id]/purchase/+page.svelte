<script lang="ts">
	import { PUBLIC_SERVER_URL, PUBLIC_STRIPE_KEY } from '$env/static/public';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { formatCurrency } from '$lib/utils';
	import { loadStripe } from '@stripe/stripe-js';
	import { Loader } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Address, Elements, LinkAuthenticationElement, PaymentElement } from 'svelte-stripe';

	let email: string | null = $state(null);
	let stripe: any = $state();
	let elements: any = $state(undefined);
	let isLoading: boolean = $state(false);
	let errorMessage: string | null = $state(null);

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_KEY);
	});
	let { data } = $props();

	let prouctId = $derived(data.product.id);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (stripe === null || !elements || isLoading || !email) isLoading = true;

		const orderExist = (
			await fetch('/api/order/exist', {
				method: 'POST',
				body: JSON.stringify({ email, prouctId }),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json();

		if (await orderExist) {
			errorMessage = 'You have already purchased this product';
			isLoading = false;
			return;
		}

		if (stripe) {
			stripe
				.confirmPayment({
					elements,
					confirmParams: {
						return_url: PUBLIC_SERVER_URL + '/stripe/purchase-status'
					}
				})
				.then(({ error }: any) => {
					if (error) {
						if (error.type === 'card_error' || error.type === 'validation_error')
							return (errorMessage = error.message);
						else {
							return (errorMessage = 'An unknown error occurred');
						}
					}
				});

			await fetch('/api/order/create', {
				method: 'POST',
				body: JSON.stringify({
					pricePaidInCents: data.product.priceInCents,
					userId: data.userId,
					productId: data.product.id
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	}
</script>

<div class="mx-auto w-full max-w-5xl space-y-8">
	<div class="flex items-center gap-4">
		<img src={data.product.imagePath} alt={data.product.name} />
		<div>
			<div class="text-lg">
				{formatCurrency(data.product.priceInCents / 100)}
			</div>
			<h1 class="text-2xl font-bold">
				{data.product.name}
			</h1>
			<p class="line-clamp-3 text-muted-foreground">
				{data.product.description}
			</p>
		</div>
	</div>

	<Elements clientSecret={data.clientSecret} {stripe} bind:elements>
		<form onsubmit={handleSubmit}>
			<Card.Root>
				<Card.Header>
					<Card.Title>Checkout</Card.Title>
					{#if errorMessage}
						<Card.Description class="text-destructive">{errorMessage}</Card.Description>
					{:else}{/if}
				</Card.Header>
				<Card.Content>
					<LinkAuthenticationElement
						on:change={(e) => {
							email = e.detail.value.email;
						}}
					/>
					<PaymentElement />
					<Address mode="billing" />
				</Card.Content>
				<Card.Footer>
					<Button type="submit" class="w-full" size="lg" disabled={stripe === null || !elements}>
						{#if isLoading}
							<Loader class="size-4 animate-spin" />
						{:else}
							Purchase - {formatCurrency(data.product.priceInCents / 100)}
						{/if}
					</Button>
				</Card.Footer>
			</Card.Root>
		</form>
	</Elements>
</div>
