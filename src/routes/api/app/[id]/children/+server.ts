import { hasModuleAccess, getChildrenModules } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET({ locals, params }) {
    const { session, user } = await locals.safeGetSession()
    if (!session || !session.user.id && await hasModuleAccess(params.id, session.user.id))
        return json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await getChildrenModules(params.id);

    if (error)
        return json({ error: 'Database error' }, { status: 500 });
    return json({ data, error: error }, { status: 200 });
}
