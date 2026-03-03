import { eq, and, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  sessionDays,
  trainingSessions,
  type TrainingSession,
  type TrainingSessionDay,
  type TrainingSessionWithCoach,
  type TrainingSessionInsert,
} from "@/schemas";
import { FullSessionSchedule } from "@/shared/types";
import { SESSION_ID_LENGTH } from "@/shared/constants";

export const sessionRepository = {
  async createSession(sessionDetails: TrainingSessionInsert): Promise<boolean> {
    const result = await db.insert(trainingSessions).values(sessionDetails);

    // drizzle returns info object; if no error, assume success
    return !!result;
  },

  async updateSession(
    id: string,
    updates: Partial<Omit<TrainingSession, "id" | "createdAt" | "updatedAt">>,
  ): Promise<boolean> {
    const result = await db
      .update(trainingSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(trainingSessions.id, id))
      .returning();

    return result.length > 0;
  },

  async deleteSession(id: string): Promise<boolean> {
    const result = await db
      .delete(trainingSessions)
      .where(eq(trainingSessions.id, id))
      .returning();

    return result.length > 0;
  },

  async getSession(id: string): Promise<TrainingSession | null> {
    const result = await db
      .select()
      .from(trainingSessions)
      .where(eq(trainingSessions.id, id));

    return result[0] ?? null;
  },

  async getAllSessions(): Promise<TrainingSession[]> {
    return db
      .select()
      .from(trainingSessions)
      .orderBy(trainingSessions.day, trainingSessions.time);
  },

  // days + their sessions with coach
  async getFullSchedule() {
    const days = await db.select().from(sessionDays).orderBy(sessionDays.day);

    const allSessions = await db.query.trainingSessions.findMany({
      with: { leadCoach: true }, // adjust relation name if different
    });

    return {
      days,
      sessions: allSessions,
    };
  },

  async getSessionDay(dayId: string) {
    const result = await db
      .select({
        id: sessionDays.id,
        day: sessionDays.day,
        createdAt: sessionDays.createdAt,
        updatedAt: sessionDays.updatedAt,
        sessions: sql<
          TrainingSession[]
        >`COALESCE(json_agg(${trainingSessions}.*), '[]'::json)`,
      })
      .from(sessionDays)
      .where(eq(sessionDays.id, dayId))
      .leftJoin(trainingSessions, eq(sessionDays.id, trainingSessions.day))
      .groupBy(sessionDays.id);

    return result[0] ?? null;
  },

  async replaceAllSessions(
    fullSchedule: FullSessionSchedule,
  ): Promise<boolean> {
    return await db.transaction(async (tx) => {
      try {
        // 1. Validate session days exist first
        const allDayIds = fullSchedule.sessionDays.map((day) => day.id);
        const existingDays = await tx
          .select({ id: sessionDays.id })
          .from(sessionDays)
          .where(inArray(sessionDays.id, allDayIds));

        if (existingDays.length !== allDayIds.length) {
          throw new Error("One or more session days don't exist");
        }

        // 2. Delete all sessions
        await tx.delete(trainingSessions);

        // 3. Bulk insert new sessions
        const insertValues = fullSchedule.sessionDays.flatMap((day) =>
          day.sessions.map((session) => ({
            day: day.id,
            time: session.time,
            age: session.age,
            gender: session.gender,
            leadCoach: session.leadCoach,
          })),
        );

        if (insertValues.length > 0) {
          await tx.insert(trainingSessions).values(insertValues);
        }

        return true;
      } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error(
          `Session replacement failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    });
  },
};
