import { redirect } from '@sveltejs/kit';
import { getModule, getChildrenModules, getTags, hasModuleAccess } from '$lib/server/db';
import type { Module, Tag } from '$lib/server/db';
import type { PageServerLoad } from './$types';

interface ModuleLoadData {
    currentModule: Module | null;
    currentModuleError: string | null;
    breadcrumbs: Module[] | null;
    breadcrumbsError: string | null;
    childModules: Module[] | null;
    childModulesError: string | null;
    tags: Tag[] | null;
    tagsError: string | null;
}

export const load: PageServerLoad = async({ params, locals }) => {
	const { session, user } = locals;

	if (!session || !user) throw redirect(303, '/#login');


    const { data: currentModule, error: currentModuleError } = await getModule(params.id);

    if (!currentModule || currentModuleError) {
        return {
            currentModule: null,
            currentModuleError: 'Could not fetch this module. Please try again.'
        };
    }

    if (!(await hasModuleAccess(currentModule.id, session.user.id))) {
        return {
            currentModule: null,
            currentModuleError: 'You do not have access to this module.'
        };
    }

    const getBreadcrumbs = async() => {
        if (currentModuleError || !currentModule)
            return { data: null, error: 'Cannot trace breadcrumbs without the main module' };

        const breadcrumbs: Module[] = [currentModule];
        let current = currentModule;
        while (current.parentId) {
            const parent = await getModule(current.parentId);
            if (parent.error || !parent.data)
                return {
                        data: breadcrumbs,
                        error: breadcrumbs
                        ? 'Could not finish fetch breadcrumbs'
                        : 'Could not fetch breadcrumbs'
                };
            breadcrumbs.push(parent.data);
            current = parent.data;
        }
        return { data: breadcrumbs.reverse(), error: null };   
    }

	const [breadcrumbs, childModules, tags] = await Promise.all([
		getBreadcrumbs(),
		getChildrenModules(currentModule.id),
        getTags(currentModule!.projectId)
	]);

    console.log("BreadcrumsbError", breadcrumbs.error);
    console.log("TagsError", tags.error);
return {
    currentModule,
    currentModuleError: currentModuleError ? 'Could not fetch current module' : null,
    breadcrumbs: breadcrumbs.data,
    breadcrumbsError: breadcrumbs.error,
    childModules: childModules.data,
    childModulesError: childModules.error ? childModules.error.message || 'Could not fetch child modules' : null,
    tags: tags.data,
    tagsError: tags.error?.message || ""
};

}