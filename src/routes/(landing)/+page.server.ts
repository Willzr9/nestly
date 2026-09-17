import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createUser } from '$lib/server/db';

export const actions: Actions = {
	checkUser: async ({ request, locals: { supabaseAdmin } }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

		if (error || !users)
			return fail(500, { error: 'Unexpected auth error' });

		const exists = users.some((user) => user.email === email.toLowerCase());

		return { exists, email }
	},
	login: async ({ request, locals: { supabase } }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error)
			return fail(404, { error: error.message });

		throw redirect(303, '/');
	},
	signup: async ({ request, locals: { supabase, supabaseAdmin } }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirm-password') as string;

		if (password !== confirmPassword)
			return fail(400, { error: 'Passwords do not match' });

		const { data: authData, error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error || !authData.user)
			return fail(400, { error: error?.message || 'Signup failed' });

		const { error: userError } = await createUser(authData.user.id);

		if (userError)
			return fail(400, { error: userError.message });

		return { success: true };
	},

	logout: async ({ locals }) => {
		const { error } = await locals.supabase.auth.signOut();

		if (error)
			return fail(500, { error: 'Failed to log out' });
		
		throw redirect(303, '/');
	}
};
