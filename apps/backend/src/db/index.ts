import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';
import postgres from 'postgres';

let client: postgres.Sql;

if (env.NODE_ENV === 'production') {
	// Production: Use Supabase
	const connectionString = env.DATABASE_URL;

	// Disable prefetch as it's not supported for "Transaction" pool mode
	client = postgres(connectionString, {
		prepare: false,
		ssl: { rejectUnauthorized: false }, // Required for Supabase connections
	});
} else {
	// Development: Use local database
	client = postgres(
		`postgres://${env.DB_USER}:${encodeURIComponent(env.DB_PASSWORD)}@${
			env.DB_HOST
		}:${env.DB_PORT}/wirralbears`
	);
}

/**
 * Database client
 */
export const db = drizzle(client, { schema });
