import { fail, redirect, type Actions } from '@sveltejs/kit';
import { db } from '../../hooks.server';
import type { PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';

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

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401, { message: 'Test' });
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/login');
	}
};
