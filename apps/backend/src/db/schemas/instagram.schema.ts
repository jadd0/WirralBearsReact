import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth.schema';
import { nanoid } from 'nanoid';

export const INSTAGRAM_TOKEN_ID_LENGTH = 21; 
export const INSTAGRAM_USER_ID_LENGTH = 32;  
export const INSTAGRAM_TOKEN_LENGTH = 255;   

export const instagramAuthTokens = pgTable('instagramAuthTokens', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(INSTAGRAM_TOKEN_ID_LENGTH)),
	userId: varchar('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	instagramUserId: varchar('instagram_user_id', { length: INSTAGRAM_USER_ID_LENGTH }).notNull(),
	accessToken: varchar('access_token', { length: INSTAGRAM_TOKEN_LENGTH }).notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type InstagramAuthTokens = typeof instagramAuthTokens.$inferInsert;
