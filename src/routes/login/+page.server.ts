import { LoginFormSchema } from '$lib/formSchema';
import { db, lucia } from '$lib/server/auth';
import { hash, verify } from '@node-rs/argon2';
import { redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
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

		// const userId = generateId(15);

		const validPassword = await verify(existingUser.hashedPassword!, form.data.password);

		if (!validPassword) return;

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '',
			...sessionCookie.attributes
		});

		/* const hashedPassword = await hash(form.data.password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		}); */

		/* try {
			await db.user.create({
				data: {
					id: userId,
					username: form.data.username,
					hashedPassword,
					email: 'cze@mail.com',
					isAdmin: true
				}
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '',
				...sessionCookie.attributes
			});
		} catch (err) {
			console.log(err);
		} */

		redirect(303, '/admin');
	}
};
