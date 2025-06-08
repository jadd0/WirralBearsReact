import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { SESSION_ID_LENGTH } from '@wirralbears/constants';
import { coaches } from './coach.schema';
import { blogs } from './blog.schema';

export const games = pgTable('games', {
	id: varchar('id', { length: SESSION_ID_LENGTH })
		.primaryKey()
		.$defaultFn(() => nanoid(SESSION_ID_LENGTH)),
	date: timestamp('date').notNull(),
	blog: varchar('blog', { length: SESSION_ID_LENGTH }).references(
		() => blogs.id,
		{ onDelete: 'set null' }
	),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type game = typeof games.$inferSelect;
