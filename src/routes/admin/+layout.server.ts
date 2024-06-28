import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}
	if (!locals.user.isAdmin) {
		redirect(302, '/');
	}

	return {};
};
