import { pgTable, varchar, text, timestamp, foreignKey, integer, index, json, uniqueIndex, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const provider = pgEnum("provider", ['google'])


export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	username: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const blogs = pgTable("blogs", {
	id: varchar().primaryKey().notNull(),
	title: varchar({ length: 50 }).notNull(),
	authorId: varchar("author_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: "blogs_author_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const blogHeadings = pgTable("blogHeadings", {
	id: varchar().primaryKey().notNull(),
	text: varchar({ length: 50 }).notNull(),
	blogId: varchar().notNull(),
	position: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blogs.id],
			name: "blogHeadings_blogId_blogs_id_fk"
		}).onDelete("cascade"),
]);

export const blogParagraphs = pgTable("blogParagraphs", {
	id: varchar().primaryKey().notNull(),
	text: varchar({ length: 500 }).notNull(),
	blogId: varchar().notNull(),
	position: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blogs.id],
			name: "blogParagraphs_blogId_blogs_id_fk"
		}).onDelete("cascade"),
]);

export const blogImages = pgTable("blog_images", {
	id: varchar().primaryKey().notNull(),
	blogId: varchar().notNull(),
	imageId: varchar().notNull(),
	position: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blogs.id],
			name: "blog_images_blogId_blogs_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "blog_images_imageId_images_id_fk"
		}).onDelete("cascade"),
]);

export const images = pgTable("images", {
	id: varchar().primaryKey().notNull(),
	key: varchar().notNull(),
	authorId: varchar("author_id").notNull(),
	url: varchar(),
	alt: varchar(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: "images_author_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const coaches = pgTable("coaches", {
	id: varchar().primaryKey().notNull(),
	title: varchar({ length: 50 }).notNull(),
	authorId: varchar("author_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: "coaches_author_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const coachImages = pgTable("coach_images", {
	id: varchar().primaryKey().notNull(),
	coachId: varchar().notNull(),
	imageId: varchar().notNull(),
	position: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.coachId],
			foreignColumns: [coaches.id],
			name: "coach_images_coachId_coaches_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "coach_images_imageId_images_id_fk"
		}).onDelete("cascade"),
]);

export const coachHeadings = pgTable("coachHeadings", {
	id: varchar().primaryKey().notNull(),
	text: varchar({ length: 50 }).notNull(),
	coachId: varchar().notNull(),
	position: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.coachId],
			foreignColumns: [coaches.id],
			name: "coachHeadings_coachId_coaches_id_fk"
		}).onDelete("cascade"),
]);

export const coachParagraphs = pgTable("coachParagraphs", {
	id: varchar().primaryKey().notNull(),
	text: varchar({ length: 500 }).notNull(),
	coachId: varchar().notNull(),
	position: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.coachId],
			foreignColumns: [coaches.id],
			name: "coachParagraphs_coachId_coaches_id_fk"
		}).onDelete("cascade"),
]);

export const sessionDays = pgTable("session_days", {
	id: varchar({ length: 7 }).primaryKey().notNull(),
	day: varchar({ length: 10 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
	id: varchar({ length: 7 }).primaryKey().notNull(),
	day: varchar({ length: 10 }).notNull(),
	time: varchar({ length: 5 }).notNull(),
	age: integer().notNull(),
	gender: varchar().notNull(),
	leadCoach: varchar("lead_coach", { length: 7 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.day],
			foreignColumns: [sessionDays.id],
			name: "sessions_day_session_days_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.leadCoach],
			foreignColumns: [coaches.id],
			name: "sessions_lead_coach_coaches_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	sid: varchar().primaryKey().notNull(),
	sess: json().notNull(),
	expire: timestamp({ precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const accountConnections = pgTable("account_connections", {
	userId: varchar("user_id").notNull(),
	provider: provider().notNull(),
	email: text(),
	providerAccountId: text("provider_account_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	uniqueIndex("unique_provider_account").using("btree", table.provider.asc().nullsLast().op("text_ops"), table.providerAccountId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "account_connections_user_id_users_id_fk"
		}),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_connections_provider_provider_account_id_pk"}),
]);
