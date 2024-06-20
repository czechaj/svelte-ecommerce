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
