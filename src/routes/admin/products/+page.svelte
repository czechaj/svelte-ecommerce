<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { formatCurrency, formatNumber } from '$lib/utils.js';
	import { CheckCircle, MoreVertical, XCircle } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="flex items-center justify-between">
	<PageHeader>Products</PageHeader>
	<Button href="/admin/products/new">New</Button>
</div>

{#if data.products.length === 0}
	<p>No products yet</p>
{:else}
	{@render productTable()}
{/if}

{#snippet productTable()}
	<Table.Root>
		<Table.Caption>A list of products.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">Available</Table.Head>
				<Table.Head>Name</Table.Head>
				<Table.Head>Price</Table.Head>
				<Table.Head>Order</Table.Head>
				<Table.Head class="text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.products as product}
				<Table.Row>
					<Table.Cell>
						{#if product.isAvailableForPurchase}
							<span class="sr-only"> available </span>
							<span>
								<CheckCircle />
							</span>
						{:else}
							<span class="sr-only"> unavailable </span>
							<span>
								<XCircle />
							</span>
						{/if}
					</Table.Cell>
					<Table.Cell>{product.name}</Table.Cell>
					<Table.Cell>{formatCurrency(product.priceInCents / 100)}</Table.Cell>
					<Table.Cell>{formatNumber(product._count.order)}</Table.Cell>
					<Table.Cell class="text-right"
						><DropdownMenu.Root>
							<DropdownMenu.Trigger
								><MoreVertical />
								<span class="sr-only">Actions</span>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Item href={`/admin/products/${product.id}/download`} download
									>Download</DropdownMenu.Item
								>
								<DropdownMenu.Item href={`/admin/products/${product.id}/edit`}
									>Edit</DropdownMenu.Item
								>
								<form action="?/toggleAvailability" method="post" use:enhance>
									<input type="hidden" name="id" value={product.id} />
									<input
										type="checkbox"
										name="isAvailableForPurchase"
										checked={!product.isAvailableForPurchase}
										class="hidden"
									/>
									<button class="w-full">
										<DropdownMenu.Item type="submit">
											{#if product.isAvailableForPurchase}
												Deactivate
											{:else}
												Activate
											{/if}
										</DropdownMenu.Item>
									</button>
								</form>
								<form action="?/deleteProduct" method="post" use:enhance>
									<input type="hidden" name="id" value={product.id} />

									<button class="w-full text-destructive" disabled={product._count.order > 0}>
										<DropdownMenu.Item type="submit">Delete</DropdownMenu.Item>
									</button>
								</form>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/snippet}
