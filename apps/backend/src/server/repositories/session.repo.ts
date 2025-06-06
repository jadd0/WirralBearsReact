import { eq, sql, and } from 'drizzle-orm';
import { db } from '@/db';
import {
	sessionDays,
	sessions,
	Session,
	SessionDay,
	coaches,
	SessionWithCoach,
	FullSessionSchedule,
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

		if (!result) return false;
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
				sessions: sql<Session[]>`COALESCE(json_agg(${sessions}.*), '[]'::json)`,
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
	async getFullSchedule(): Promise<FullSessionSchedule> {
		const rows = await db
			.select({
				id: sessionDays.id,
				day: sessionDays.day,
				createdAt: sessionDays.createdAt,
				updatedAt: sessionDays.updatedAt,
				session: sessions, // This will be null if no session exists for the day
			})
			.from(sessionDays)
			.leftJoin(sessions, eq(sessionDays.id, sessions.day))
			.orderBy(sessionDays.day, sessions.time);

		// Group sessions by sessionDay id
		const sessionDayMap = new Map();

		for (const row of rows) {
			if (!sessionDayMap.has(row.id)) {
				sessionDayMap.set(row.id, {
					id: row.id,
					day: row.day,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					sessions: [],
				});
			}
			if (row.session) {
				sessionDayMap.get(row.id).sessions.push(row.session);
			}
		}

		// Convert map to array
		const sessionDaysArr = Array.from(sessionDayMap.values()).map((day) => ({
			...day,
			sessions: day.sessions.length > 0 ? day.sessions : [],
		}));

		// Define the order of days
		const dayOrder = [
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday',
		];

		// Sort sessionDaysArr by day of the week
		sessionDaysArr.sort((a, b) => {
			return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
		});

		return { sessionDays: sessionDaysArr };
	},
};
