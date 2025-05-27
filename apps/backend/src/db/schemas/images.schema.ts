import {
	integer,
	json,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import { users } from './auth.schema';
import { nanoid } from 'nanoid';
import {
	BLOG_ID_LENGTH,
	BLOG_MAX_HEADING_LENGTH,
	BLOG_MAX_PARAGRAPH_LENGTH,
	BLOG_MAX_TITLE_LENGTH,
} from '@wirralbears/constants';
import { ELEMENT_CONSTRAINTS } from '@wirralbears/constants';
import { blogs } from './blog.schema';

// First table for storing image metadata
export const images = pgTable('images', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	key: varchar('key').notNull(),
	authorId: varchar('author_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	url: varchar('url'),
	alt: varchar('alt'),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

// Second table for the relationship between blogs and images
export const blogImages = pgTable('blog_images', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	blogId: varchar('blogId')
		.notNull()
		.references(() => blogs.id, { onDelete: 'cascade' }),
	imageId: varchar('imageId')
		.notNull()
		.references(() => images.id, { onDelete: 'cascade' }),
	position: integer('position').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});
