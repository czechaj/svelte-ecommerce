import { db } from '$lib/../hooks.server';
import { UserFormSchema } from '$lib/formSchema';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { id } }) => {
	const user = await db.user.findUnique({ where: { id } });
	return {
		user,
		form: await superValidate(user, zod(UserFormSchema), { errors: false })
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	async default({ request, params: { id } }) {
		const form = await superValidate(request, zod(UserFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const user = await db.user.findUnique({ where: { id } });

		if (!user) return;

		try {
			await db.user.update({
				where: { id },
				data: {
					username: form.data.username,
					email: form.data.email,
					isAdmin: form.data.isAdmin
				}
			});
		} catch (err) {
			console.log(err);
		}

		redirect(303, '/admin/users');
	}
};
