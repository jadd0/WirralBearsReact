import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  sessionDays,
  trainingSessions,
  type Session,
  type SessionDay,
  type SessionWithCoach,
  type SessionInsert,
} from "@/schemas";

export type FullSessionSchedule = {
  days: SessionDay[];
  sessions: SessionWithCoach[];
};

export const sessionRepository = {
  async createSession(sessionDetails: SessionInsert): Promise<boolean> {
    const result = await db.insert(trainingSessions).values(sessionDetails);

    // drizzle returns info object; if no error, assume success
    return !!result;
  },

  async updateSession(
    id: string,
    updates: Partial<Omit<Session, "id" | "createdAt" | "updatedAt">>,
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

  async getSession(id: string): Promise<Session | null> {
    const result = await db
      .select()
      .from(trainingSessions)
      .where(eq(trainingSessions.id, id));

    return result[0] ?? null;
  },

  async getAllSessions(): Promise<Session[]> {
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
    const [day] = await db
      .select()
      .from(sessionDays)
      .where(eq(sessionDays.id, dayId));

    if (!day) return null;

    const daySessions = await db.query.trainingSessions.findMany({
      where: (s, { eq }) => eq(s.day, dayId),
      with: { leadCoach: true },
    });

    return { day, sessions: daySessions };
  },

  // destroy & recreate everything
  async replaceAllSessions(schedule: FullSessionSchedule) {
    return db.transaction(async (tx) => {
      const dayIds = schedule.days.map((d) => d.id);

      // wipe existing sessions for these days
      if (dayIds.length > 0) {
        await tx
          .delete(trainingSessions)
          .where(inArray(trainingSessions.day, dayIds));
      }

      // insert new days (onConflictDoNothing equivalent if needed)
      if (schedule.days.length > 0) {
        await tx.insert(sessionDays).values(schedule.days as SessionDay[]);
      }

      if (schedule.sessions.length > 0) {
        await tx.insert(trainingSessions).values(
          schedule.sessions.map((s) => ({
            ...s,
            createdAt: s.createdAt ?? new Date(),
            updatedAt: new Date(),
          })) as Session[],
        );
      }

      return true;
    });
  },
};
