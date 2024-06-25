<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { formatNumber } from '$lib/utils.js';
	import { CheckCircle, MoreVertical, XCircle } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="flex items-center justify-between">
	<PageHeader>Users</PageHeader>
	<Button href="/admin/users/new">New</Button>
</div>

{#if data.users.length === 0}
	<p>No users yet</p>
{:else}
	{@render userTable()}
{/if}

{#snippet userTable()}
	<Table.Root>
		<Table.Caption>A list of users.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">Admin</Table.Head>
				<Table.Head>Username</Table.Head>
				<Table.Head>Email</Table.Head>
				<Table.Head>Order</Table.Head>
				<Table.Head class="text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.users as user}
				<Table.Row>
					<Table.Cell>
						{#if user.isAdmin}
							<span class="sr-only"> admin </span>
							<span>
								<CheckCircle />
							</span>
						{:else}
							<span class="sr-only"> user </span>
							<span>
								<XCircle />
							</span>
						{/if}
					</Table.Cell>
					<Table.Cell>{user.username}</Table.Cell>
					<Table.Cell>{user.email}</Table.Cell>
					<Table.Cell>{formatNumber(user._count.order)}</Table.Cell>
					<Table.Cell class="text-right"
						><DropdownMenu.Root>
							<DropdownMenu.Trigger
								><MoreVertical />
								<span class="sr-only">Actions</span>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Item href={`/admin/users/${user.id}/download`} download
									>Download</DropdownMenu.Item
								>
								<DropdownMenu.Item href={`/admin/users/${user.id}/edit`}>Edit</DropdownMenu.Item>
								<!-- 	<form action="?/toggleAvailability" method="post" use:enhance>
								<input type="hidden" name="id" value={user.id} />
								<input
									type="checkbox"
									name="isAvailableForPurchase"
									checked={!user.isAvailableForPurchase}
									class="hidden"
								/>
								<button class="w-full">
									<DropdownMenu.Item type="submit">
										{#if user.isAvailableForPurchase}
											Deactivate
										{:else}
											Activate
										{/if}
									</DropdownMenu.Item>
								</button>
							</form> -->
								<form action="?/deleteUser" method="post" use:enhance>
									<input type="hidden" name="id" value={user.id} />

									<button class="w-full text-destructive" disabled={user._count.order > 0}>
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
