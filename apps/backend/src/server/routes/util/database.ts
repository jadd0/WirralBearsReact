import { env } from '@/env';
import pg from 'pg';
import postgres from 'postgres';

export function createDatabasePool() {
	if (env.NODE_ENV === 'production') {
		console.log('Creating production database pool...');
		return new pg.Pool({
			connectionString: env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false,
			},
			max: 10,

			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 30000,
		});
	} else {
		console.log('Creating development database pool...');
		return new pg.Pool({
			user: env.DB_USER,
			host: env.DB_HOST,
			port: env.DB_PORT,
			password: env.DB_PASSWORD,
			database: env.DB_NAME,
			max: 10,

			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 30000,
		});
	}
}

export function createPostgresClient() {
	if (env.NODE_ENV === 'production') {
		console.log('Creating production postgres client...');
		return postgres(env.DATABASE_URL, {
			prepare: false,
			ssl: { rejectUnauthorized: false },
			max: 10,
			connect_timeout: 30,
			idle_timeout: 20,
			max_lifetime: 60 * 30,
			onnotice: () => {},
			debug: false,
		});
	} else {
		console.log('Creating development postgres client...');
		const connectionString = `postgres://${env.DB_USER}:${encodeURIComponent(
			env.DB_PASSWORD
		)}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
		return postgres(connectionString, {
			ssl: false,
			max: 10,
			connect_timeout: 30,
			debug: false,
		});
	}
}
