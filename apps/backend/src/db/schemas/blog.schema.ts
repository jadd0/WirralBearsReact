import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth.schema';
import { nanoid } from 'nanoid';
import {
	BLOG_ID_LENGTH,
	BLOG_MAX_HEADING_LENGTH,
	BLOG_MAX_PARAGRAPH_LENGTH,
	BLOG_MAX_TITLE_LENGTH,
} from '@wirralbears/constants';

export const blogs = pgTable('blogs', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	title: varchar('title', { length: BLOG_MAX_TITLE_LENGTH }).notNull(),
	authorId: varchar('author_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blogHeadings = pgTable('blogHeadings', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	text: varchar('text', { length: BLOG_MAX_HEADING_LENGTH }).notNull(),
	blogId: varchar('blogId')
		.notNull()
		.references(() => blogs.id, { onDelete: 'cascade' }),
	position: integer('position').notNull(),
});

export const blogParagraphs = pgTable('blogParagraphs', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	text: varchar('text', { length: BLOG_MAX_PARAGRAPH_LENGTH }).notNull(),
	blogId: varchar('blogId')
		.notNull()
		.references(() => blogs.id, { onDelete: 'cascade' }),
	position: integer('position').notNull(),
});

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
export type BlogHeading = typeof blogHeadings.$inferInsert;
export type BlogParagraph = typeof blogParagraphs.$inferInsert;
