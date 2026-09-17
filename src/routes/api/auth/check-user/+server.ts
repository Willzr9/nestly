import { json } from '@sveltejs/kit';

export async function POST({ request, locals: { supabaseAdmin } }) {
    const { email } = await request.json();
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error)
        return json({ error: error.message }, { status: 500 });

    const exists = users.some(user => user.email === email.toLowerCase());
    return json({ exists, error: null }, { status: 200 });
}