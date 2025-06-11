import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';
import postgres from 'postgres';

let client: postgres.Sql;

console.log(env.DATABASE_URL)

console.log('=== DATABASE CONNECTION DEBUG ===');
console.log('NODE_ENV:', env.NODE_ENV);
console.log('DATABASE_URL exists:', !!env.DATABASE_URL);
console.log('DATABASE_URL value:', env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DB_HOST:', env.DB_HOST);
console.log('DB_PORT:', env.DB_PORT);
console.log('DB_USER:', env.DB_USER);

if (env.NODE_ENV === 'production') {
	console.log('🔄 Using PRODUCTION configuration');

	if (env.DATABASE_URL) {
		console.log(
			'📡 Connecting to Supabase with URL:',
			env.DATABASE_URL.substring(0, 30) + '...'
		);
		client = postgres(env.DATABASE_URL, {
			prepare: false,
			ssl: {
				rejectUnauthorized: false,
			},
		});
	} else {
		console.log('❌ No DATABASE_URL found, falling back to local config');
		client = postgres(
			`postgres://${env.DB_USER}:${encodeURIComponent(env.DB_PASSWORD)}@${
				env.DB_HOST
			}:${env.DB_PORT}/wirralbears`,
			{
				ssl: false,
			}
		);
	}
} else {
	console.log('🏠 Using DEVELOPMENT configuration');
	const localConnectionString = `postgres://${env.DB_USER}:${encodeURIComponent(
		env.DB_PASSWORD
	)}@${env.DB_HOST}:${env.DB_PORT}/wirralbears`;
	console.log('🔗 Local connection string:', localConnectionString);

	client = postgres(localConnectionString, {
		ssl: false,
	});
}

console.log('=== END DATABASE DEBUG ===');

export const db = drizzle(client, { schema });
