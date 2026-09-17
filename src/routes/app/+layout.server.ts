import type { LayoutServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { getUserProjects, getSharedProjects } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession()

  if (!session || !user)
	throw redirect(303, '/#login')

  console.log("Fetching projects for user:", user.id);

  const { data: ownedProjects, error: ownedError } = await getUserProjects(user.id);
  const { data: sharedProjects, error: sharedError } = await getSharedProjects(user.id);

  console.log("Shared projects:", sharedProjects);
  console.log("Owned error:", ownedError);
  console.log("Shared error:", sharedError);
  return {
    user: user ? { id: user.id, email: user.email } : null,
    ownedProjects: ownedProjects ?? [],
    sharedProjects: sharedProjects ?? [],
    ownedError: ownedError ? ownedError.message : null,
    sharedError: sharedError ? sharedError.message : null
  };
};