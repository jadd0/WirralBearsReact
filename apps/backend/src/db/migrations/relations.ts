import { relations } from "drizzle-orm/relations";
import { users, blogs, blogHeadings, blogParagraphs, blogImages, images, coaches, coachImages, coachHeadings, coachParagraphs, sessionDays, sessions, accountConnections } from "./schema";

export const blogsRelations = relations(blogs, ({one, many}) => ({
	user: one(users, {
		fields: [blogs.authorId],
		references: [users.id]
	}),
	blogHeadings: many(blogHeadings),
	blogParagraphs: many(blogParagraphs),
	blogImages: many(blogImages),
}));

export const usersRelations = relations(users, ({many}) => ({
	blogs: many(blogs),
	images: many(images),
	coaches: many(coaches),
	accountConnections: many(accountConnections),
}));

export const blogHeadingsRelations = relations(blogHeadings, ({one}) => ({
	blog: one(blogs, {
		fields: [blogHeadings.blogId],
		references: [blogs.id]
	}),
}));

export const blogParagraphsRelations = relations(blogParagraphs, ({one}) => ({
	blog: one(blogs, {
		fields: [blogParagraphs.blogId],
		references: [blogs.id]
	}),
}));

export const blogImagesRelations = relations(blogImages, ({one}) => ({
	blog: one(blogs, {
		fields: [blogImages.blogId],
		references: [blogs.id]
	}),
	image: one(images, {
		fields: [blogImages.imageId],
		references: [images.id]
	}),
}));

export const imagesRelations = relations(images, ({one, many}) => ({
	blogImages: many(blogImages),
	user: one(users, {
		fields: [images.authorId],
		references: [users.id]
	}),
	coachImages: many(coachImages),
}));

export const coachesRelations = relations(coaches, ({one, many}) => ({
	user: one(users, {
		fields: [coaches.authorId],
		references: [users.id]
	}),
	coachImages: many(coachImages),
	coachHeadings: many(coachHeadings),
	coachParagraphs: many(coachParagraphs),
	sessions: many(sessions),
}));

export const coachImagesRelations = relations(coachImages, ({one}) => ({
	coach: one(coaches, {
		fields: [coachImages.coachId],
		references: [coaches.id]
	}),
	image: one(images, {
		fields: [coachImages.imageId],
		references: [images.id]
	}),
}));

export const coachHeadingsRelations = relations(coachHeadings, ({one}) => ({
	coach: one(coaches, {
		fields: [coachHeadings.coachId],
		references: [coaches.id]
	}),
}));

export const coachParagraphsRelations = relations(coachParagraphs, ({one}) => ({
	coach: one(coaches, {
		fields: [coachParagraphs.coachId],
		references: [coaches.id]
	}),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	sessionDay: one(sessionDays, {
		fields: [sessions.day],
		references: [sessionDays.id]
	}),
	coach: one(coaches, {
		fields: [sessions.leadCoach],
		references: [coaches.id]
	}),
}));

export const sessionDaysRelations = relations(sessionDays, ({many}) => ({
	sessions: many(sessions),
}));

export const accountConnectionsRelations = relations(accountConnections, ({one}) => ({
	user: one(users, {
		fields: [accountConnections.userId],
		references: [users.id]
	}),
}));