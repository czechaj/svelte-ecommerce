import { LoginFormSchema } from '$lib/formSchema';
import { db, lucia } from '$lib/server/auth';
import { verify } from '@node-rs/argon2';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.session?.userId) {
		return redirect(302, '/');
	}
	return {
		form: await superValidate(zod(LoginFormSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	async default({ request, cookies }) {
		const form = await superValidate(request, zod(LoginFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const existingUser = await db.user.findUnique({ where: { username: form.data.username } });

		if (!existingUser) {
			return;
		}

		const validPassword = await verify(existingUser.hashedPassword!, form.data.password);

		if (!validPassword) return;

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '',
			...sessionCookie.attributes
		});

		redirect(303, existingUser.isAdmin ? '/admin' : '/');
	}
};
