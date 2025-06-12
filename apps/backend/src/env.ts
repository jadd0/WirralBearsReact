import dotenv from 'dotenv';

dotenv.config({ path: './.env.local', debug: true, encoding: 'utf8' });
import { z } from 'zod';

/**
 * SCHEMA FOR BACKEND ENV VARIABLES
 */
const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	PORT: z.coerce.number().optional().default(3000),

	// DATABASE - Required for local development
	DB_USER: z.string().min(1),
	DB_PASSWORD: z.string().min(1),
	DB_HOST: z.string().min(1),
	DB_PORT: z.coerce.number().default(5432),
	DB_NAME: z.string().min(1),
	DATABASE_URL: z.string().min(1),

	// SUPABASE - Only required in production
	SUPABASE_URL: z.string().url().optional(),
	SUPABASE_ANON_KEY: z.string().min(1).optional(),
	SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

	// SERVER
	CLIENT_ORIGIN: z.string().url().default('http://localhost:3000'),

	// AUTH
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	SESSION_SECRET: z.string().min(1).optional(),
	ADMIN_EMAIL: z.string().min(1).optional(),

	// UPLOADTHING
	UPLOADTHING_TOKEN: z.string().min(1),
	UPLOAD_THING_APP_ID: z.string().min(1),

	// ADMIN EMAIL ADDRESSES
	ADMIN_EMAIL_JADD: z.string().min(1),
	ADMIN_EMAIL_WIRRALBEARS: z.string().min(1),
	ADMIN_EMAIL_MARTIN: z.string().min(1),
	ADMIN_EMAIL_DOWDSTERS: z.string().min(1),
	ADMIN_EMAIL_SKYE: z.string().min(1)
});

/**
 * Validate environment based on context
 */
const validateEnvironment = (parsedEnv: any) => {
	const isLocal = parsedEnv.NODE_ENV === 'development'; // Use parsedEnv directly
	const isProduction = parsedEnv.NODE_ENV === 'production';

	// In production, require Supabase variables
	if (isProduction) {
		const requiredProdVars = [
			'SUPABASE_URL',
			'SUPABASE_ANON_KEY',
			'SUPABASE_SERVICE_ROLE_KEY',
		];

		const missingVars = requiredProdVars.filter(
			(varName) => !parsedEnv[varName]
		);

		if (missingVars.length > 0) {
			throw new Error(
				`PRODUCTION DEPLOYMENT MISSING REQUIRED ENV VARS: [\n${missingVars
					.map((v) => `\t'${v}' - Required in production`)
					.join(',\n')}\n]`
			);
		}
	}

	// In development, require local database variables
	if (isLocal) {
		const requiredLocalVars = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME'];
		const missingVars = requiredLocalVars.filter(
			(varName) => !parsedEnv[varName]
		);

		if (missingVars.length > 0) {
			throw new Error(
				`LOCAL DEVELOPMENT MISSING REQUIRED DATABASE VARS: [\n${missingVars
					.map((v) => `\t'${v}' - Required for local PostgreSQL connection`)
					.join(',\n')}\n]`
			);
		}
	}

	return parsedEnv;
};

/**
 * type-safe backend env variables
 */
export const env = (() => {
	try {
		const parsed = envSchema.parse(process.env);
		const validated = validateEnvironment(parsed);

		// Log configuration info
		const isLocal = validated.NODE_ENV === 'development'; // Use validated directly
		console.log(`🔧 Environment Configuration:`);
		console.log(`   Mode: ${validated.NODE_ENV}`);
		console.log(
			`   Database: ${isLocal ? 'LOCAL PostgreSQL' : 'REMOTE Supabase'}`
		);
		if (isLocal) {
			console.log(`   DB Host: ${validated.DB_HOST}:${validated.DB_PORT}`);
			console.log(`   DB Name: ${validated.DB_NAME}`);
		} else {
			console.log(`   Supabase URL: ${validated.SUPABASE_URL}`);
		}

		return validated;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(
				`INVALID ENV: [\n${error.errors
					.map((e) => `\t'${e.path}' - ${e.message}`)
					.join(',\n')}\n]`
			);
		} else throw error;
	}
})();

/**
 * Export utility functions
 */
export const isLocalDevelopment = () => env.NODE_ENV === 'development';
export const isProduction = () => env.NODE_ENV === 'production';
export const useSupabase = () => isProduction();
