// src/db/schema/blog.ts
import {
	integer,
	json,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

export const blogs = pgTable('blogs', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	content: json('content').notNull(), // Store the blog elements as JSON
	authorId: integer('author_id').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
