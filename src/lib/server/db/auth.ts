import { getDb } from './index';
import { and, eq, or, inArray, isNull, Table } from 'drizzle-orm';
import { projects, collaborators, modules } from './schema';
import type { Module } from './index';

export async function hasModuleAccess(moduleId: string, userId: string): Promise<boolean> {
	try {
		let currentModuleId = moduleId;

		while (true) {
			const db = getDb();
			const isCollaborator = await db
				.select()
				.from(collaborators)
				.where(and(eq(collaborators.moduleId, currentModuleId), eq(collaborators.userId, userId)))
				.limit(1)
				.then((rows) => rows.length > 0);

			if (isCollaborator) return true;

			const module = await db
				.select()
				.from(modules)
				.where(eq(modules.id, currentModuleId))
				.limit(1)
				.then((rows) => rows[0]);

			if (!module) return false;

			if (module.parentId === null) {
				const isRootOwner = await db
					.select()
					.from(projects)
					.where(and(eq(projects.id, currentModuleId), eq(projects.userId, userId)))
					.limit(1)
					.then((rows) => rows.length > 0);

				return isRootOwner;
			}
			currentModuleId = module.parentId;
		}
	} catch (error) {
		return false;
	}
}
