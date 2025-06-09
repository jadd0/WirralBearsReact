import pg from 'pg';
import { env } from '@/env';

export const createDatabasePool = () => {
	if (env.NODE_ENV === 'production') {
		// Use Supabase connection string in production
		return new pg.Pool({
			connectionString: env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false,
			},
		});
	} else {
		// Use local PostgreSQL in development
		return new pg.Pool({
			user: env.DB_USER,
			host: env.DB_HOST,
			port: env.DB_PORT,
			password: env.DB_PASSWORD,
			database: 'wirralbears',
		});
	}
};
