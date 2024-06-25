import { UserFormSchema } from '$lib/formSchema';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
export const load = (async () => {
	return {
		form: await superValidate(zod(UserFormSchema))
	};
}) satisfies PageServerLoad;

import { redirect } from '@sveltejs/kit';
import { db } from '../../../../hooks.server';
import type { Actions } from './$types';

export const actions: Actions = {
	async default({ request }) {
		const form = await superValidate(request, zod(UserFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.user.create({
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
