import {
	integer,
	pgTable,
	timestamp,
	varchar,
	numeric,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { SESSION_ID_LENGTH } from '@wirralbears/constants';
import { coaches } from './coach.schema';
import { blogs } from './blog.schema';

// TODO: Maybe change to accomodate age groups and area?
export const seasons = pgTable('seasons', {
	id: varchar('id', { length: SESSION_ID_LENGTH })
		.primaryKey()
		.$defaultFn(() => nanoid(SESSION_ID_LENGTH)),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	season: varchar('season', { length: 10 }),
	gender: varchar('gender', { length: 10 }).notNull(),
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
	gender: varchar('gender', { length: 10 }).notNull(),
	season: varchar('season', { length: SESSION_ID_LENGTH })
		.notNull()
		.references(() => seasons.id, { onDelete: 'cascade' }),
	ourScore: integer('our_score').notNull(),
	otherScore: integer('other_score').notNull(),
});

export type Game = typeof games.$inferSelect;
export type Season = typeof seasons.$inferSelect;
export type GameInsert = typeof games.$inferInsert;
export type SeasonInsert = typeof seasons.$inferInsert;

export type GamesBySeason = {
	season: string;
	seasonId: string;
	games: Game[];
}[];
