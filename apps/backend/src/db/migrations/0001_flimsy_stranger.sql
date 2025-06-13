CREATE TABLE "games" (
	"id" varchar(7) PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"blog" varchar(7),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"gender" varchar(10) NOT NULL,
	"season" varchar(7) NOT NULL,
	"our_score" integer NOT NULL,
	"other_score" integer NOT NULL,
	"other_team_name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" varchar(7) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"season" varchar(10),
	"gender" varchar(10) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_blog_blogs_id_fk" FOREIGN KEY ("blog") REFERENCES "public"."blogs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_season_seasons_id_fk" FOREIGN KEY ("season") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;