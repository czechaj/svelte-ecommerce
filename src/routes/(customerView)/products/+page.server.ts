import { db } from '../../../hooks.server';
import type { PageServerLoad } from './$types';

async function getProducts() {
	return await db.product.findMany({
		where: { isAvailableForPurchase: true },
		orderBy: { name: 'asc' }
	});
}

export const load = (async () => {
	return {
		products: await getProducts()
	};
}) satisfies PageServerLoad;
