import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

	// DATABASE
	DATABASE_URL: z.string().min(1),

	// AUTH
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	AUTH_SECRET: z.string().min(1),

	// ADMIN EMAIL ADDRESSES
	ADMIN_EMAIL_JADD: z.string().min(1),
	ADMIN_EMAIL_WIRRALBEARS: z.string().min(1),
	ADMIN_EMAIL_MARTIN: z.string().min(1),
	ADMIN_EMAIL_DOWDSTERS: z.string().min(1),
	ADMIN_EMAIL_SKYE: z.string().min(1),

	// UPLOADTHING
	UPLOADTHING_TOKEN: z.string().min(1),
	UPLOAD_THING_APP_ID: z.string().min(1),
});

export const env = (() => {
	const parsed = envSchema.safeParse(process.env);
	if (!parsed.success) {
		throw new Error(
			`INVALID ENV: [\n${parsed.error.errors
				.map((e) => `\t'${e.path}' - ${e.message}`)
				.join(',\n')}\n]`
		);
	}
	return parsed.data;
})();
