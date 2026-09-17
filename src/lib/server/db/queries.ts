
import { getDb } from './index';
import { and, eq, or, inArray, isNull, Table } from 'drizzle-orm';
import { projects, collaborators, modules, tags, moduleTags, users } from './schema';
import type { Module, Tag } from './index';

export async function getUserProjects(userId: string) {
  try {
    const db = getDb();
    const data = await db
      .select()
      .from(projects)
      .innerJoin(modules, eq(projects.id, modules.id))
      .where(eq(projects.userId, userId))
      .then(rows => rows.map(row => row.modules));
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function getSharedProjects(userId: string): Promise<{ data: Module[] | null; error: Error | null}> {
  try {
    const db = getDb();
    const projectList = await db
      .select()
      .from(collaborators)
      .innerJoin(modules, eq(collaborators.moduleId, modules.id))
      .where(eq(collaborators.userId, userId))
      .then(rows => rows.map(row => row.modules));

    return { data: projectList, error: null};
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function getChildrenModules(parentId: string): Promise<{ data: Module[] | null; error: Error | null}> {
  try {
    const db = getDb();
    const data = await db
      .select()
      .from(modules)
      .where(eq(modules.parentId, parentId))
      .leftJoin(moduleTags, eq(modules.id, moduleTags.moduleId))
      .leftJoin(tags, eq(moduleTags.tagId, tags.id));

    const moduleMap = new Map<string, Module & { tags: Tag[] }>();

    for (const row of data) {
      if (!moduleMap.has(row.modules.id))
        moduleMap.set(row.modules.id, { ...row.modules, tags: [] });

      if (row.module_tags?.moduleId)
        moduleMap.get(row.modules.id)!.tags.push(row.tags);
    }
    return { data: Array.from(moduleMap.values()), error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function getModule(moduleId: string): Promise<{ data: Module | null; error: Error | null}> {
  try {
    const db = getDb();
    const data = await db
      .select()
      .from(modules)
      .where(eq(modules.id, moduleId))
      .leftJoin(moduleTags, eq(modules.id, moduleTags.moduleId))
      .leftJoin(tags, eq(moduleTags.tagId, tags.id));

    const moduleMap = new Map<string, Module & { tags: Tag[] }>();

    moduleMap.set(data[0].modules.id, { ...data[0].modules, tags: [] });

    for (const row of data) {        
      if (row.module_tags?.moduleId)
        moduleMap.get(row.modules.id)!.tags.push(row.tags);
    }
    
    return { data: moduleMap.get(moduleId), error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function getBreadcrumbs(moduleId: string): Promise<{ data: Module[] | null; error: Error | null}> {
  const { data: mainModule, error: mainModuleError } = await getModule(moduleId);

  if (mainModuleError || !mainModule)
      return { data: null, error: new Error('Cannot trace breadcrumbs without the main module') };

  const breadcrumbs: Module[] = [mainModule];
  try {
    let current = mainModule;
    while (current.parentId) {
        const parent = await getModule(current.parentId);
        if (parent.error || !parent.data)
            return { data: breadcrumbs, error: breadcrumbs ? 'Could not finish fetch breadcrumbs' : 'Could not fetch breadcrumbs'
            };
        breadcrumbs.push(parent.data);
        current = parent.data;
    }
  } catch (error) {
    return { data: breadcrumbs, error: error as Error };
  }
  return { data: breadcrumbs.reverse(), error: null };   
}

export async function getTags(projectId: string): Promise<{ data: Tag[] | null; error: Error | null}> {
  try {
    const db = getDb();
    const tagsData = await db
      .select()
      .from(tags)
      .where(eq(tags.projectId, projectId));
    return { data: tagsData, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function validateTag(moduleId: string, tagId: string) {
  try {
    const db = getDb();
    const tagsData = await db
      .select()
      .from(moduleTags)
      .where(and(eq(moduleTags.moduleId, moduleId) ,eq(moduleTags.tagId, tagId)));

    return tagsData.length > 0;
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function removeTag(moduleId: string, tagId: string) {
  try {
    const db = getDb();
    const removedTag = await db
      .delete(moduleTags)
      .where(and(eq(moduleTags.moduleId, moduleId) ,eq(moduleTags.tagId, tagId)))
      .returning();

    return { data: removedTag, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function addTag(moduleId: string, tagId: string) {
  try {
    const db = getDb();
    const addedTag = await db
      .insert(moduleTags)
      .values({moduleId, tagId})
      .returning()

    return { data: addedTag, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function createNewProject(userId: string) {
  try {
    const db = getDb();
    const [project] = await db
      .insert(projects)
      .values({ userId })
      .returning();

    const [module] = await db
      .insert(modules)
      .values({
        id: project.id,
        projectId: project.id,
        title: 'Untitled Project',
        type: 'project'
      })
      .returning();

    await createTag(project.id, 'Important', '#ff0000');
    await createTag(project.id, 'Idea', '#00ff00');
    await createTag(project.id, 'Research', '#0000ff');

    return { data: { ...project, ...module }, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function createNewModule(projectId: string, type: string, parentId: string | null = null): Promise<{ data: typeof modules._['inferSelect'] | null; error: Error | null}> {
  try {
    const db = getDb();
    const title = `Untitled ${type[0].toUpperCase() + type.slice(1)}`;
    const [data] = await db
      .insert(modules)
      .values({ projectId, parentId, type: type as "project" | "card" | "collection", title })
      .returning();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateModule(match: Partial<Module>, updates: Partial<Module>) {
  try {
    const db = getDb();
    const [data] = await db
      .update(modules)
      .set(updates)
      .where(and(...Object.entries(match).map(([k, v]) => eq((modules as any)[k], v))))
      .returning();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function insertModule(payload: Partial<Module>) {
  const sanitized = { ...payload };
  delete sanitized.createdAt;

  try {
    const db = getDb();
    const [data] = await db
      .insert(modules)
      .values(sanitized)
      .returning();
      
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteModule(match: Partial<Module>) {
  try {
    const db = getDb();
    const data = await db
      .delete(modules)
      .where(and(...Object.entries(match).map(([k, v]) => eq((modules as any)[k], v))))
      .returning();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function duplicateModule(id: string) {
  const { data: originalModule, error: fetchError } = await getModule(id);

  if (fetchError || !originalModule)
    throw fetchError;

  const { id: _, createdAt: __, ...moduleToDuplicate } = originalModule;

  try {
    const db = getDb();
    const [newModule] = await db
      .insert(modules)
      .values(moduleToDuplicate)
      .returning();

    const { data: childModules, error: childModulesError } = await getChildrenModules(id);

    if (childModulesError || !childModules)
      throw childModulesError;
    for (const child of childModules) {
      const { id: _, createdAt: __, ...childToDuplicate } = child;

      await db
        .insert(modules)
        .values({
          ...childToDuplicate,
          parentId: newModule.id
        });
    }

    return { data: newModule, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createTag(projectId: string, name: string, color: string) {
  try {
    const db = getDb();
    const [data] = await db
      .insert(tags)
      .values({ projectId, name, color })
      .returning();

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function createUser(id: string) {
  try {
    const db = getDb();
    const [data] = await db
      .insert(users)
      .values({ id })
      .returning();

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}