<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { formatCurrency, formatNumber } from '$lib/utils.js';
	import { CheckCircle, MoreVertical, XCircle } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	let { data } = $props();
</script>

<div class="flex items-center justify-between gap-4">
	<PageHeader>Products</PageHeader>
	<Button href="/admin/products/new">New</Button>
</div>

<Table.Root>
	<Table.Caption>A list of your recent invoices.</Table.Caption>
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
							<DropdownMenu.Group>
								<DropdownMenu.Item href={`/admn/products/${product.id}/download`} download
									>Download</DropdownMenu.Item
								>
								<DropdownMenu.Item href={`/admn/products/${product.id}/edit`}
									>Edit</DropdownMenu.Item
								>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
