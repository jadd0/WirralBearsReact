import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/env';
import * as schema from './schema';

// Next.js dev hot-reload re-evaluates this module on every edit; caching the
// client on globalThis stops each reload from opening a fresh pool against
// Supabase's connection limit.
const globalForDb = globalThis as unknown as {
	postgresClient?: ReturnType<typeof postgres>;
};

function createClient() {
	return postgres(env.DATABASE_URL, {
		prepare: false,
		ssl: { rejectUnauthorized: false },
		max: 10,
		connect_timeout: 30,
		idle_timeout: 20,
		max_lifetime: 60 * 30,
		onnotice: () => {},
	});
}

const client = globalForDb.postgresClient ?? createClient();
if (env.NODE_ENV !== 'production') {
	globalForDb.postgresClient = client;
}

export const db = drizzle(client, { schema });
