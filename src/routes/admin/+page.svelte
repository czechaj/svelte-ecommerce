<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatCurrency, formatNumber } from '$lib/utils';

	type DashboardCardProps = {
		title: string;
		subtitle: string;
		body: string;
	};

	let { data } = $props();

	let { productData, salesData, userData } = $derived(data);
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	<div>
		{@render dashboardCard({
			title: 'Sales',
			subtitle: `${formatNumber(salesData.numberOfSales)} Orders`,
			body: formatCurrency(salesData.amount)
		})}
	</div>
	<div>
		{@render dashboardCard({
			title: 'Customers',
			subtitle: `${formatCurrency(userData.avgValuePerUser)} Avg Value`,
			body: formatNumber(userData.userCount)
		})}
	</div>
	<div>
		{@render dashboardCard({
			title: 'Active Products',
			subtitle: `${formatNumber(productData.inactiveCount)} Inactive Products`,
			body: formatNumber(productData.activeCount)
		})}
	</div>
</div>

{#snippet dashboardCard({title, body, subtitle}:DashboardCardProps)}
	<Card.Root>
		<Card.Header>
			<Card.Title>{title}</Card.Title>
			<Card.Description>{subtitle}</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>{body}</p>
		</Card.Content>
	</Card.Root>
{/snippet}
