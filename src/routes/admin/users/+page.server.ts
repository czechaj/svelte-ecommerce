import type { Actions } from '@sveltejs/kit';
// import fs from 'fs/promises';
import { db } from '../../../hooks.server';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		users: await db.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				isAdmin: true,
				_count: {
					select: {
						order: true
					}
				}
			},
			orderBy: { name: 'asc' }
		})
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	deleteUser: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		const user = await db.user.findUnique({
			where: { id },
			select: { _count: { select: { order: true } } }
		});

		if (user && user._count.order > 0) return;

		const deletedUser = await db.user.delete({ where: { id } });

		return deletedUser;

		// await fs.unlink(deletedUser.filePath);
		// await fs.unlink(`static${deletedUser.imagePath}`);
	}
};
