import { ProfileFormSchema } from '$lib/formSchema';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '../../../hooks.server';
import type { Actions, PageServerLoad } from './$types';
import { hash } from '@node-rs/argon2';

export const load = (async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) return redirect(302, '/login');

	const user = await db.user.findFirst({
		where: { id: userId }
	});

	return {
		user,
		form: await superValidate(user, zod(ProfileFormSchema), { errors: false })
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	async default({ request, locals }) {
		if (!locals.user) return fail(401, { message: 'Not logged in' });

		const form = await superValidate(request, zod(ProfileFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const user = await db.user.findUnique({ where: { id: locals.user.id } });

		if (!user) return;

		const hashedPassword = await hash(form.data.password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.user.update({
				where: { id: user.id },
				data: {
					username: form.data.username,
					email: form.data.email,
					hashedPassword
				}
			});
		} catch (err) {
			console.log(err);
		}

		redirect(303, '/');
	}
};
