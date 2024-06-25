import type { Actions } from '@sveltejs/kit';
import { db } from '../../../hooks.server';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		orders: await db.order.findMany({
			select: {
				id: true,
				pricePaidInCents: true,
				product: {
					select: {
						name: true
					}
				},
				user: {
					select: { email: true }
				}
			},
			orderBy: { createdAt: 'desc' }
		})
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	deleteOrder: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		const deletedOrder = await db.order.delete({ where: { id } });
		return deletedOrder;
	}
};
