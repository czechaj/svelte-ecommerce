import type { PageServerLoad } from './$types';
import { db } from '../../hooks.server';

async function getSalesData() {
	const data = await db.order.aggregate({
		_sum: { pricePaidInCents: true },
		_count: true
	});

	return {
		amount: (data._sum.pricePaidInCents || 0) / 100,
		numberOfSales: data._count
	};
}
async function getUserData() {
	const [userCount, orderData] = await Promise.all([
		await db.user.count(),
		await db.order.aggregate({
			_sum: { pricePaidInCents: true }
		})
	]);

	return {
		userCount,
		avgValuePerUser: !userCount ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 1000
	};
}
async function getProductData() {
	const [activeCount, inactiveCount] = await Promise.all([
		await db.product.count({ where: { isAvailableForPurchase: true } }),
		await db.product.count({
			where: { isAvailableForPurchase: false }
		})
	]);

	return {
		activeCount,
		inactiveCount
	};
}

export const load = (async () => {
	const [salesData, userData, productData] = await Promise.all([
		getSalesData(),
		getUserData(),
		getProductData()
	]);

	return {
		salesData,
		userData,
		productData
	};
}) satisfies PageServerLoad;
