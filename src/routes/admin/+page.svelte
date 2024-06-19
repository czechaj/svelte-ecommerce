<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatCurrency, formatNumber } from '$lib/utils';

	type DashboardCardProps = {
		title: string;
		subtitle: string;
		body: string;
	};
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	<div>
		{@render dashboardCard({
			title: 'Sales',
			subtitle: `${formatNumber(20000)} Orders`,
			body: formatCurrency(10000000)
		})}
	</div>
	<div>
		{@render dashboardCard({
			title: 'Sales',
			subtitle: `${formatNumber(20000)} Orders`,
			body: formatCurrency(10000000)
		})}
	</div>
	<div>
		{@render dashboardCard({
			title: 'Sales',
			subtitle: `${formatNumber(20000)} Orders`,
			body: formatCurrency(10000000)
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
