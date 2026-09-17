import { json } from '@sveltejs/kit';
import { updateModule } from '$lib/server/db';

export async function PATCH({ request, params, locals }) {
    const { session, user } = await locals.safeGetSession()

    if (!session)
        return json({ error: 'Unauthorized' }, { status: 401 });

    const id = params.id;
    const updates = await request.json();

    const { data, error } = await updateModule({ id: id }, updates);

    return json({ data, error: error ? "Could not save updates" : null }, { status: error ? 500 : 200 });
}