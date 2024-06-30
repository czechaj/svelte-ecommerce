import { db } from '../../../../hooks.server.js';

export const POST = async ({ request }) => {
	const { userId, productId, pricePaidInCents } = await request.json();

	const newOrder = await db.order.create({
		data: {
			userId,
			productId,
			pricePaidInCents
		}
	});

	return new Response(
		JSON.stringify({
			success: true,
			data: newOrder
		})
	);
};
