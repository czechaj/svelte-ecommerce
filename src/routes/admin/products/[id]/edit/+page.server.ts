import { db } from '$lib/../hooks.server';
import { ProductFormSchema } from '$lib/formSchema';
import { redirect } from '@sveltejs/kit';
import fs from 'fs/promises';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { id } }) => {
	const product = await db.product.findUnique({ where: { id } });
	return {
		product,
		form: await superValidate(product, zod(ProductFormSchema), { errors: false })
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	async default({ request, params: { id } }) {
		const form = await superValidate(
			request,
			zod(ProductFormSchema.partial({ file: true, image: true }))
		);

		if (!form.valid) {
			return fail(400, { form });
		}

		const product = await db.product.findUnique({ where: { id } });

		if (!product) return;

		let filePath = product.filePath;

		if (form.data.file) {
			await fs.unlink(filePath);

			filePath = `products/${Math.random()}-${form.data.file.name}`;
			await fs.writeFile(filePath, Buffer.from(await form.data.file.arrayBuffer()));
		}

		let imagePath = product.imagePath;
		if (form.data.image) {
			await fs.unlink(`static${imagePath}`);

			imagePath = `/products/${Math.random()}-${form.data.image.name}`;
			await fs.writeFile(`static${imagePath}`, Buffer.from(await form.data.image.arrayBuffer()));
		}

		try {
			await db.product.update({
				where: { id },
				data: {
					name: form.data.name,
					description: form.data.description,
					priceInCents: form.data.priceInCents,
					filePath,
					imagePath
				}
			});
		} catch (err) {
			console.log(err);
		}

		redirect(303, '/admin/products');
	}
};
