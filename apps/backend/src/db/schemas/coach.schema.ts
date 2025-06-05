import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth.schema';
import { nanoid } from 'nanoid';
import {
	COACH_ID_LENGTH,
	COACH_MAX_HEADING_LENGTH,
	COACH_MAX_PARAGRAPH_LENGTH,
	COACH_MAX_TITLE_LENGTH,
} from '@wirralbears/constants';

export const coaches = pgTable('coaches', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(COACH_ID_LENGTH)),
	title: varchar('title', { length: COACH_MAX_TITLE_LENGTH }).notNull(),
	authorId: varchar('author_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const coachHeadings = pgTable('coachHeadings', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(COACH_ID_LENGTH)),
	text: varchar('text', { length: COACH_MAX_HEADING_LENGTH }).notNull(),
	coachId: varchar('coachId')
		.notNull()
		.references(() => coaches.id, { onDelete: 'cascade' }),
	position: integer('position').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

export const coachParagraphs = pgTable('coachParagraphs', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(COACH_ID_LENGTH)),
	text: varchar('text', { length: COACH_MAX_PARAGRAPH_LENGTH }).notNull(),
	coachId: varchar('coachId')
		.notNull()
		.references(() => coaches.id, { onDelete: 'cascade' }),
	position: integer('position').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

export type Coaches = typeof coaches.$inferSelect;
export type NewCoach = typeof coaches.$inferInsert;
export type CoachHeading = typeof coachHeadings.$inferInsert;
export type CoachParagraph = typeof coachParagraphs.$inferInsert;
