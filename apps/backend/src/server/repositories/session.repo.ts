import { eq, sql, and } from 'drizzle-orm';
import { db } from '@/db';
import { Session, SessionDay } from '@wirralbears/types';
import { session, sessionDays, coaches } from '@/db/schema';
import { nanoid } from 'nanoid';
import { SESSION_ID_LENGTH } from '@wirralbears/constants';

export const sessionRepository = {
	async createSession(
		sessionDetails: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>
	) {
		const [newSession] = await db
			.insert(session)
			.values({
				// Map frontend names to DB columns
				day: sessionDetails.day,
				time: sessionDetails.time,
				age: sessionDetails.age,
				gender: sessionDetails.gender,
				coach: sessionDetails.leadCoach, 
			})
			.returning();
		return newSession;
	},
	async updateSession(
		id: string,
		updates: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>
	) {
		const [updated] = await db
			.update(session)
			.set({ ...updates, updatedAt: new Date() })
			.where(eq(session.id, id))
			.returning();
		return updated;
	},

	async deleteSession(id: string): Promise<boolean> {
		const result = await db
			.delete(session)
			.where(eq(session.id, id))
			.returning();
		return result.length > 0;
	},

	async getSession(id: string) {
		const result = await db
			.select()
			.from(session)
			.where(eq(session.id, id))
			.leftJoin(coaches, eq(session.coach, coaches.id));

		if (!result[0]) return null;

		const { sessions, coaches: coach } = result[0];
		return {
			...sessions,
			coach,
		};
	},

	async getSessionDay(dayId: string) {
		const result = await db
			.select()
			.from(sessionDays)
			.where(eq(sessionDays.id, dayId))
			.leftJoin(session, eq(sessionDays.id, session.day));

		if (!result[0]) return null;

		return {
			...result[0].session_days,
			sessions: result.map((r) => r.sessions).filter(Boolean),
		};
	},

	async getAllSessionDays() {
		return await db.select().from(sessionDays).orderBy(sessionDays.day);
	},

	async createSessionDay(sessionDayDetails: SessionDay) {
		const [newSessionDay] = await db
			.insert(sessionDays)
			.values(sessionDayDetails)
			.returning();
		return newSessionDay;
	},

	async deleteSessionDay(id: string): Promise<boolean> {
		const result = await db
			.delete(sessionDays)
			.where(eq(sessionDays.id, id))
			.returning();
		return result.length > 0;
	},
};
