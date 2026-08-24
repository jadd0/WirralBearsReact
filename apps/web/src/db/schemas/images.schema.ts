import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth.schema';
import { nanoid } from 'nanoid';
import { BLOG_ID_LENGTH } from '@/lib/constants';
import { blogs } from './blog.schema';
import { coaches } from './coach.schema';

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

export type Image = typeof images.$inferSelect;

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

// Second table for the relationship between coaches and images
export const coachImages = pgTable('coach_images', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	coachId: varchar('coachId')
		.notNull()
		.references(() => coaches.id, { onDelete: 'cascade' }),
	imageId: varchar('imageId')
		.notNull()
		.references(() => images.id, { onDelete: 'cascade' }),
	position: integer('position').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

export const firstCarousel = pgTable('first_carousel', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	key: varchar('key').notNull(),
	imageId: varchar('imageId')
		.notNull()
		.references(() => images.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

export const secondCarousel = pgTable('second_carousel', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid(BLOG_ID_LENGTH)),
	key: varchar('key').notNull(),
	imageId: varchar('imageId')
		.notNull()
		.references(() => images.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});
