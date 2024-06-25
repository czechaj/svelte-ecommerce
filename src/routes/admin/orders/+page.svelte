<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { formatCurrency } from '$lib/utils.js';
	import { MoreVertical } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="flex items-center justify-between">
	<PageHeader>Orders</PageHeader>
</div>

{#if !data?.orders || !data?.orders?.length}
	<p>No orders yet</p>
{:else}
	{@render orderTable()}
{/if}

{#snippet orderTable()}
	<Table.Root>
		<Table.Caption>A list of orders.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Product</Table.Head>
				<Table.Head>Customer</Table.Head>
				<Table.Head>Price Paid</Table.Head>
				<Table.Head class="text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.orders as order}
				<Table.Row>
					<Table.Cell>{order?.product?.name}</Table.Cell>
					<Table.Cell>{order?.user?.email}</Table.Cell>
					<Table.Cell>{formatCurrency(order.pricePaidInCents / 100)}</Table.Cell>
					<Table.Cell class="text-right"
						><DropdownMenu.Root>
							<DropdownMenu.Trigger
								><MoreVertical />
								<span class="sr-only">Actions</span>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<form action="?/deleteOrder" method="post" use:enhance>
									<input type="hidden" name="id" value={order.id} />

									<button class="w-full text-destructive">
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
