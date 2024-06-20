import type { Actions } from '@sveltejs/kit';
import { db } from '../../../hooks.server';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		products: await db.product.findMany({
			select: {
				id: true,
				name: true,
				priceInCents: true,
				isAvailableForPurchase: true,
				imagePath: true,
				_count: {
					select: {
						order: true
					}
				}
			},
			orderBy: { name: 'asc' }
		})
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	toggleAvailability: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const isAvailableForPurchase = formData.has('isAvailableForPurchase');

		await db.product.update({
			where: { id },
			data: {
				isAvailableForPurchase
			}
		});
	}
};