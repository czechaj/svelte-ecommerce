import { db } from '../../hooks.server';
import type { PageServerLoad } from './$types';

async function getMostPopularProducts() {
	return await db.product.findMany({
		where: {
			isAvailableForPurchase: true
		},
		take: 6,
		orderBy: { order: { _count: 'desc' } }
	});
}
async function getNewestProducts() {
	return await db.product.findMany({
		where: {
			isAvailableForPurchase: true
		},
		take: 6,
		orderBy: { createdAt: 'desc' }
	});
}

export const load: PageServerLoad = async () => {
	const [mostPopularProducts, newestProducts] = await Promise.all([
		getMostPopularProducts(),
		getNewestProducts()
	]);

	return {
		mostPopularProducts,
		newestProducts
	};
};
