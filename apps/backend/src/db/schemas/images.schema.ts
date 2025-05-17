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

// Includes owner id to see who uplaoded what
export const images = pgTable('images', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	key: varchar('key').notNull(),
	authorId: varchar('author_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
});

export const blogImages = pgTable('images', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	blogId: varchar('blogId')
		.notNull()
		.references(() => blogs.id, { onDelete: 'cascade' }),
	position: integer('position').notNull(),
});
