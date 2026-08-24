import {
	pgTable,
	text,
	timestamp,
	varchar,
	primaryKey,
	integer,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import type { AdapterAccountType } from 'next-auth/adapters';

/**
 * The pre-existing `users` table from the old Passport-based backend, kept
 * as-is (same id values) so blogs/coaches/images author FKs stay intact,
 * plus the columns NextAuth's DrizzleAdapter expects on a users table.
 */
export const users = pgTable('users', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(12)),
	username: text('username'),
	name: text('name'),
	email: text('email').unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
	role: text('role').notNull().default('user'),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
});

export const accounts = pgTable(
	'account',
	{
		userId: varchar('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
	},
	(account) => [
		primaryKey({ columns: [account.provider, account.providerAccountId] }),
	]
);

export const authSessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: varchar('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	(vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);
