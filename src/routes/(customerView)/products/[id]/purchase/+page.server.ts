import { error, redirect } from '@sveltejs/kit';
import { db } from '../../../../../hooks.server';
import type { PageServerLoad } from '../$types';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
const stripe = new Stripe(STRIPE_SECRET_KEY);

export const load = (async ({ params, locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const product = await db.product.findUnique({ where: { id: params.id } });

	if (!product) error(404, 'Not Found');

	const paymentIntent = await stripe.paymentIntents.create({
		amount: product.priceInCents,
		currency: 'TRY',
		metadata: {
			productId: product.id
		},
		automatic_payment_methods: {
			enabled: true
		}
	});

	if (paymentIntent.client_secret === null) throw Error('Failed to create payment intent');

	return {
		product: product,
		clientSecret: paymentIntent.client_secret,
		userId: locals.user.id
	};
}) satisfies PageServerLoad;
