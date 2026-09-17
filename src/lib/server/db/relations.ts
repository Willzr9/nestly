import { relations } from "drizzle-orm/relations";
import { modules, collaborators, users, projects, tags, moduleTags } from "./schema";
//usersinAuth
export const collaboratorsRelations = relations(collaborators, ({one}) => ({
	module: one(modules, {
		fields: [collaborators.moduleId],
		references: [modules.id]
	}),
	user: one(users, {
		fields: [collaborators.userId],
		references: [users.id]
	}),
}));

export const modulesRelations = relations(modules, ({one, many}) => ({
	collaborators: many(collaborators),
	module: one(modules, {
		fields: [modules.parentId],
		references: [modules.id],
		relationName: "modules_parentId_modules_id"
	}),
	modules: many(modules, {
		relationName: "modules_parentId_modules_id"
	}),
	project: one(projects, {
		fields: [modules.projectId],
		references: [projects.id]
	}),
	moduleTags: many(moduleTags),
}));

// export const usersRelations = relations(users, ({one, many}) => ({
// 	collaborators: many(collaborators),
// 	usersInAuth: one(usersInAuth, {
// 		fields: [users.id],
// 		references: [usersInAuth.id]
// 	}),
// 	projects: many(projects),
// }));

// export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
// 	users: many(users),
// }));

export const projectsRelations = relations(projects, ({one, many}) => ({
	modules: many(modules),
	tags: many(tags),
	user: one(users, {
		fields: [projects.userId],
		references: [users.id]
	}),
}));

export const tagsRelations = relations(tags, ({one, many}) => ({
	project: one(projects, {
		fields: [tags.projectId],
		references: [projects.id]
	}),
	moduleTags: many(moduleTags),
}));

export const moduleTagsRelations = relations(moduleTags, ({one}) => ({
	module: one(modules, {
		fields: [moduleTags.moduleId],
		references: [modules.id]
	}),
	tag: one(tags, {
		fields: [moduleTags.tagId],
		references: [tags.id]
	}),
}));