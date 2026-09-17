import { redirect, fail, type Actions } from '@sveltejs/kit';
import { createNewProject } from '$lib/server/db';

export const actions: Actions = {
	createProject: async ({ locals}) => {
		const { session, user } = await locals.safeGetSession();
		if (!session)
			return fail(401, { error: 'Not authenticated' });

		const { data, error } = await createNewProject(session.user.id);

		console.log("Creating new project for user:", session.user.id);		
		if (error) {
			console.log("Error creating project:", error);
			return fail(500, { error: error.message });
		}

		return {
			success: true,
			newProject: data
		};
	}
};