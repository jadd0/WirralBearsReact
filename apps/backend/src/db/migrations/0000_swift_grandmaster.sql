DROP TYPE IF EXISTS "public"."provider" CASCADE;
CREATE TYPE "public"."provider" AS ENUM('google');--> statement-breakpoint

DROP TABLE IF EXISTS "account_connections" CASCADE;
CREATE TABLE "account_connections" (
	"user_id" varchar NOT NULL,
	"provider" "provider" NOT NULL,
	"email" text,
	"provider_account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "account_connections_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE IF EXISTS "blogHeadings" CASCADE;

CREATE TABLE "blogHeadings" (
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar(50) NOT NULL,
	"blogId" varchar NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE IF EXISTS "blogParagraphs" CASCADE;

CREATE TABLE "blogParagraphs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar(500) NOT NULL,
	"blogId" varchar NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE IF EXISTS "blogs" CASCADE;

CREATE TABLE "blogs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar(50) NOT NULL,
	"author_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE IF EXISTS "blog_images" CASCADE;

CREATE TABLE "blog_images" (
	"id" varchar PRIMARY KEY NOT NULL,
	"blogId" varchar NOT NULL,
	"imageId" varchar NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE IF EXISTS "coach_images" CASCADE;

CREATE TABLE "coach_images" (
	"id" varchar PRIMARY KEY NOT NULL,
	"coachId" varchar NOT NULL,
	"imageId" varchar NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE IF EXISTS "images" CASCADE;

CREATE TABLE "images" (
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"author_id" varchar NOT NULL,
	"url" varchar,
	"alt" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE IF EXISTS "coachHeadings" CASCADE;

CREATE TABLE "coachHeadings" (
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar(50) NOT NULL,
	"coachId" varchar NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE IF EXISTS "coachParagraphs" CASCADE;

CREATE TABLE "coachParagraphs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar(500) NOT NULL,
	"coachId" varchar NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE IF EXISTS "coaches" CASCADE;

CREATE TABLE "coaches" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar(50) NOT NULL,
	"author_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE IF EXISTS "session_days" CASCADE;

CREATE TABLE "session_days" (
	"id" varchar(7) PRIMARY KEY NOT NULL,
	"day" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE IF EXISTS "sessions" CASCADE;

CREATE TABLE "sessions" (
	"id" varchar(7) PRIMARY KEY NOT NULL,
	"day" varchar(10) NOT NULL,
	"time" varchar(5) NOT NULL,
	"age" integer NOT NULL,
	"gender" varchar NOT NULL,
	"lead_coach" varchar(7) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_connections" ADD CONSTRAINT "account_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogHeadings" ADD CONSTRAINT "blogHeadings_blogId_blogs_id_fk" FOREIGN KEY ("blogId") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogParagraphs" ADD CONSTRAINT "blogParagraphs_blogId_blogs_id_fk" FOREIGN KEY ("blogId") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_images" ADD CONSTRAINT "blog_images_blogId_blogs_id_fk" FOREIGN KEY ("blogId") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_images" ADD CONSTRAINT "blog_images_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_images" ADD CONSTRAINT "coach_images_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_images" ADD CONSTRAINT "coach_images_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coachHeadings" ADD CONSTRAINT "coachHeadings_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coachParagraphs" ADD CONSTRAINT "coachParagraphs_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_day_session_days_id_fk" FOREIGN KEY ("day") REFERENCES "public"."session_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_lead_coach_coaches_id_fk" FOREIGN KEY ("lead_coach") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_provider_account" ON "account_connections" USING btree ("provider","provider_account_id");