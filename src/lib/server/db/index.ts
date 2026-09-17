import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  const client = postgres(env.DATABASE_URL, {
    max: 1,      // single connection is enough for serverless
    idle_timeout: 5, 
    connect_timeout: 5,
  });
  return drizzle(client, { schema });
}

export * from './schema';
export * from './relations';
export * from './queries';
export * from './auth';

export type Module = typeof schema.modules.$inferSelect;
export type Project = typeof schema.projects.$inferSelect;
export type Tag = typeof schema.tags.$inferSelect;
export type ModuleTag = typeof schema.moduleTags.$inferSelect;

