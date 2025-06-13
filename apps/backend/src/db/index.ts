import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';
import { createPostgresClient } from '@/utils/database';

let client: ReturnType<typeof createPostgresClient> | null = null;

console.log('=== DATABASE CONNECTION DEBUG ===');
console.log('NODE_ENV:', env.NODE_ENV);
console.log('DATABASE_URL exists:', !!env.DATABASE_URL);
console.log('DATABASE_URL value:', env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DB_HOST:', env.DB_HOST);
console.log('DB_PORT:', env.DB_PORT);
console.log('DB_USER:', env.DB_USER);

function getClient() {
	if (!client) {
		client = createPostgresClient();
	}
	return client;
}

console.log('=== END DATABASE DEBUG ===');

export const db = drizzle(getClient(), { schema });

// Graceful shutdown
process.on('SIGINT', async () => {
	if (client) {
		await client.end();
		console.log('Database connection closed.');
	}
	process.exit(0);
});

process.on('SIGTERM', async () => {
	if (client) {
		await client.end();
		console.log('Database connection closed.');
	}
	process.exit(0);
});
