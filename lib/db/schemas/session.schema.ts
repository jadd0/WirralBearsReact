import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { SESSION_ID_LENGTH } from "@/constants";
import { coaches } from "./coach.schema";

// Enums and types
const GENDER_ENUM = ["Male", "Female", "Mixed"] as const;
const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
const WEEKDAY_LENGTH = 10;

export const sessionDays = pgTable("session_days", {
  id: varchar("id", { length: SESSION_ID_LENGTH })
    .primaryKey()
    .$defaultFn(() => nanoid(SESSION_ID_LENGTH)),
  day: varchar("day", { length: WEEKDAY_LENGTH })
    .$type<(typeof WEEKDAYS)[number]>()
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const trainingSessions = pgTable("trainingSession", {
  id: varchar("id", { length: SESSION_ID_LENGTH })
    .primaryKey()
    .$defaultFn(() => nanoid(SESSION_ID_LENGTH)),
  day: varchar("day", { length: WEEKDAY_LENGTH })
    .notNull()
    .references(() => sessionDays.id, { onDelete: "cascade" }),
  time: varchar("time", { length: 5 }).notNull(), // Stores HH:MM format
  age: integer("age").notNull(),
  gender: varchar("gender", { enum: GENDER_ENUM }).notNull(),
  leadCoach: varchar("lead_coach", { length: SESSION_ID_LENGTH })
    .notNull()
    .references(() => coaches.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TrainingSessionDay = typeof sessionDays.$inferSelect;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type TrainingSessionWithCoach = TrainingSession & {
  coach: typeof coaches.$inferSelect | null;
};
export type FullTrainingSessionSchedule = {
  sessionDays: (TrainingSessionDay & { sessions: TrainingSessionWithCoach[] })[];
};
export type TrainingSessionInsert = typeof trainingSessions.$inferInsert;
