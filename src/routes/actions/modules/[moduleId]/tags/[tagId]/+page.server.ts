import { fail, type Actions } from '@sveltejs/kit';
import { validateTag, addTag, removeTag } from '$lib/server/db';

export const actions: Actions = {
    removeTag: async ({ params, locals }) => {
        const { session, user } = await locals.safeGetSession()
        if (!session)
            return fail(401, { error: 'Not authenticated' });

        if (!params.moduleId || !params.tagId)
            return fail(400, { error: 'Missing moduleId or tagId' });

        if (!(await validateTag(params.moduleId, params.tagId)))
            return fail(400, { error: 'Invalid tag for module' });

        const { data, error } = await removeTag(params.moduleId, params.tagId);

        if (error) 
            return fail(500, { error });

        return {
            success: true,
            data
        };
    },
    addTag: async ({ params, locals }) => {
        const { session, user } = await locals.safeGetSession()
        if (!session)
            return fail(401, { error: 'Not authenticated' });

        if (!params.moduleId || !params.tagId)
            return fail(400, { error: 'Missing moduleId or tagId' });

        if ((await validateTag(params.moduleId, params.tagId)))
            return fail(400, { error: 'Invalid tag for module' });

        const { data, error } = await addTag(params.moduleId, params.tagId);

        if (error) 
            return fail(500, { error });

        return {
            success: true,
            data
        };
    }
};