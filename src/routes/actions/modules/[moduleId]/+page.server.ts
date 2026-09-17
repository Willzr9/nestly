import { fail, type Actions } from '@sveltejs/kit';
import { createNewModule, deleteModule, duplicateModule } from '$lib/server/db';

export const actions: Actions = {
	deleteModule: async ({ params, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session)
			return fail(401, { error: 'Not authenticated' });

		const { data, error } = await deleteModule({id: params.moduleId});

		if (error)
			return fail(500, { error });

		return {
			success: true,
			data
		};
	},
	duplicateModule: async ({ params, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session)
			return fail(401, { error: 'Not authenticated' });

		const { data, error } = await duplicateModule(params.moduleId!);

		if (error)
			return fail(500, { error });
		return {
			success: true,
			data
		};
	},
	createNewCard: async ({ params, request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session)
			return fail(401, { error: 'Not authenticated' });

		const formData = await request.formData();
		const projectId = formData.get('projectId');

		const { error } = await createNewModule(projectId as string, 'card', params.moduleId);

		if (error)
			return fail(500, { error: error.message });
	},
	createNewCollection: async ({ params, request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session)
			return fail(401, { error: 'Not authenticated' });

		const formData = await request.formData();
		const projectId = formData.get('projectId');

		const { data, error } = await createNewModule(projectId as string, 'collection', params.moduleId);

		if (error)
			return fail(500, { error: error.message });

		return {
			success: true,
			newProject: data
		};
	}
};