import { pgTable, foreignKey, uuid, timestamp, pgPolicy, unique, jsonb, text, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const moduleTypes = pgEnum("moduleTypes", ['card', 'collection', 'project'])


export const collaborators = pgTable("collaborators", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	moduleId: uuid("module_id").defaultRandom().notNull(),
	userId: uuid("user_id").defaultRandom().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.moduleId],
			foreignColumns: [modules.id],
			name: "collaborators_module_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "collaborators_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "users_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("users_update_own", { as: "permissive", for: "update", to: ["public"], using: sql`(auth.uid() = id)`, withCheck: sql`(auth.uid() = id)`  }),
	pgPolicy("users_select_own", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("users_insert_own", { as: "permissive", for: "select", to: ["public"] }),
]);

export const modules = pgTable("modules", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	parentId: uuid("parent_id"),
	body: jsonb().default({"type":"doc","content":[{"type":"paragraph","content":[]}]}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	title: text().default('\'Untitled Module').notNull(),
	projectId: uuid("project_id").notNull(),
	type: moduleTypes(),
}, (table) => [
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "modules_parent_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "modules_project_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("modules_id_key").on(table.id),
	pgPolicy("Allow select for all", { as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = modules.project_id) AND (projects.user_id = auth.uid()))))` }),
	pgPolicy("allow_users_to_update_own_blocks", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can read their own blocks", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("modules_delete_own", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const stars = pgTable("stars", {
	userId: uuid("user_id").notNull(),
	itemId: uuid("item_id").array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
});

export const tags = pgTable("tags", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").defaultRandom().notNull(),
	name: text().default('Untitled Tag').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	color: text(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "tags_project_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const projects = pgTable("projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").default(sql`auth.uid()`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "projects_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Allow select for all", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Users can read their own collections", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("allow_users_to_update_own_blocks", { as: "permissive", for: "update", to: ["public"] }),
]);

export const moduleTags = pgTable("module_tags", {
	moduleId: uuid("module_id").defaultRandom().notNull(),
	tagId: uuid("tag_id").defaultRandom().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.moduleId],
			foreignColumns: [modules.id],
			name: "module_tags_module_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "module_tags_tag_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.moduleId, table.tagId], name: "module_tags_pkey"}),
]);
