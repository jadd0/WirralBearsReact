import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth.schema';
import { nanoid } from 'nanoid';
import { SESSION_AGE_GROUPS, SESSION_ID_LENGTH } from '@wirralbears/constants';

const WEEKDAY_LENGTH = 9;

export const sessionDays = pgTable('coaches', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(SESSION_ID_LENGTH)),
	day: varchar('day', { length: WEEKDAY_LENGTH }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = pgTable('coaches', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(SESSION_ID_LENGTH)),
	day: varchar('day')
		.notNull()
		.references(() => sessionDays.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	age: integer('age').notNull(), 
});

export type SessionDay = typeof sessionDays.$inferInsert;
export type Session = typeof session.$inferInsert;