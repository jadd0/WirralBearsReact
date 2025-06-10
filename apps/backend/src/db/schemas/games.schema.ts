import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { SESSION_ID_LENGTH } from '@wirralbears/constants';
import { coaches } from './coach.schema';
import { blogs } from './blog.schema';

export const seasons = pgTable('seasons', {
	id: varchar('id', { length: SESSION_ID_LENGTH })
		.primaryKey()
		.$defaultFn(() => nanoid(SESSION_ID_LENGTH)),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	season: varchar('season', { length: 10 }),
	gender: varchar('string', { length: 10 }).notNull(),
});

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
	gender: varchar('string', { length: 10 }).notNull(),
	season: varchar('season', { length: SESSION_ID_LENGTH })
		.notNull()
		.references(() => seasons.id, { onDelete: 'cascade' }),
});

export type game = typeof games.$inferSelect;
export type season = typeof seasons.$inferSelect;
export type gameInsert = typeof games.$inferInsert;
export type seasonInsert = typeof seasons.$inferInsert;

export type GamesBySeason = {
	season: string;
	seasonId: string;
	games: game[];
}[];