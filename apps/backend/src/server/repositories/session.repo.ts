import { eq, sql, and } from 'drizzle-orm';
import { db } from '@/db';
import {
	sessionDays,
	sessions,
	Session,
	SessionDay,
	coaches,
	SessionWithCoach,
} from '@/db/schema';
import { nanoid } from 'nanoid';
import { SESSION_ID_LENGTH } from '@wirralbears/constants';
import { SessionDayWithSessions } from '@wirralbears/types';

export const sessionRepository = {
	async createSession(sessionDetails: Session): Promise<boolean> {
		const result = await db.insert(sessions).values({
			...sessionDetails,
			id: nanoid(SESSION_ID_LENGTH),
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		return true;
	},

	async updateSession(
		id: string,
		updates: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>
	): Promise<boolean> {
		const result = await db
			.update(sessions)
			.set({ ...updates, updatedAt: new Date() })
			.where(eq(sessions.id, id))
			.returning();

		if (!result) return false;
		return true;
	},

	async deleteSession(id: string): Promise<boolean> {
		const result = await db
			.delete(sessions)
			.where(eq(sessions.id, id))
			.returning();
		return result.length > 0;
	},

	async getSession(id: string): Promise<SessionWithCoach | null> {
		const result = await db
			.select({
				session: sessions,
				coach: coaches,
			})
			.from(sessions)
			.where(eq(sessions.id, id))
			.leftJoin(coaches, eq(sessions.leadCoach, coaches.id));

		if (!result[0]) return null;

		return {
			...result[0].session,
			coach: result[0].coach,
		};
	},

	async getSessionDay(dayId: string) {
    const result = await db
        .select({
            id: sessionDays.id,
            day: sessionDays.day,
            createdAt: sessionDays.createdAt,
            updatedAt: sessionDays.updatedAt,
            sessions: sql<Session[]>`COALESCE(json_agg(${sessions}.*), '[]'::json)`
        })
        .from(sessionDays)
        .where(eq(sessionDays.id, dayId))
        .leftJoin(sessions, eq(sessionDays.id, sessions.day))
        .groupBy(sessionDays.id);

    return result[0] ?? null;
},


	async getAllSessionDays(): Promise<SessionDay[]> {
		return await db.select().from(sessionDays).orderBy(sessionDays.day);
	},

	async getAllSessions(): Promise<Session[]> {
		return await db.select().from(sessions);
	},
};
