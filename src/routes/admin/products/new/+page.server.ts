import { ProductFormSchema } from '$lib/formSchema';
import fs from 'fs/promises';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
export const load = (async () => {
	return {
		form: await superValidate(zod(ProductFormSchema))
	};
}) satisfies PageServerLoad;

import { redirect } from '@sveltejs/kit';
import { db } from '../../../../hooks.server';
import type { Actions } from './$types';

export const actions: Actions = {
	async default({ request }) {
		const form = await superValidate(request, zod(ProductFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		await fs.mkdir('products', { recursive: true });
		const filePath = `products/${Math.random()}-${form.data.file.name}`;

		await fs.writeFile(filePath, Buffer.from(await form.data.file.arrayBuffer()));

		await fs.mkdir('static/products', { recursive: true });
		const imagePath = `/products/${Math.random()}-${form.data.image.name}`;

		await fs.writeFile(`static${imagePath}`, Buffer.from(await form.data.image.arrayBuffer()));

		try {
			await db.product.create({
				data: {
					name: form.data.name,
					description: form.data.description,
					priceInCents: form.data.priceInCents,
					filePath,
					imagePath,
					isAvailableForPurchase: false
				}
			});
		} catch (err) {
			console.log(err);
		}

		redirect(303, '/admin/products');
	}
};
