import { sessionRepository } from '../repositories/session.repo';
import { Session, SessionDay } from '@wirralbears/types';
import { Coaches } from '@/db/schemas/coach.schema';
import { FullSessionSchedule } from '@/db/schema';

export const sessionServices = {
	/**
	 * Get all sessions (basic list)
	 */
	async getAllSessions() {
		try {
			return await sessionRepository.getAllSessions();
		} catch (error) {
			console.error('Failed to fetch sessions:', error);
			throw new Error('Failed to fetch sessions');
		}
	},

	/**
	 * Create a new session
	 */
	async createSession(sessionData: Session) {
		try {
			return await sessionRepository.createSession(sessionData);
		} catch (error) {
			console.error('Session creation failed:', error);
			throw new Error('Failed to create session');
		}
	},

	/**
	 * Update a session
	 */
	async updateSession(
		sessionId: string,
		updates: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>
	) {
		try {
			const existingSession = await sessionRepository.getSession(sessionId);
			if (!existingSession) {
				throw new Error('Session not found');
			}
			return await sessionRepository.updateSession(sessionId, updates);
		} catch (error) {
			console.error('Session update failed:', error);
			throw new Error('Failed to update session');
		}
	},

	/**
	 * Delete a session
	 */
	async deleteSession(sessionId: string) {
		try {
			const result = await sessionRepository.deleteSession(sessionId);
			if (!result) {
				throw new Error('Session not found or could not be deleted');
			}
			return result;
		} catch (error) {
			console.error('Session deletion failed:', error);
			throw new Error('Failed to delete session');
		}
	},

	/**
	 * Get a session by ID
	 */
	async getSession(sessionId: string) {
		try {
			const session = await sessionRepository.getSession(sessionId);
			if (!session) {
				throw new Error('Session not found');
			}
			return session;
		} catch (error) {
			console.error('Failed to fetch session:', error);
			throw new Error('Failed to fetch session');
		}
	},

	/**
	 * Get all session days with their sessions
	 */
	async getFullSchedule() {
		try {
			const result = await sessionRepository.getFullSchedule();
			return result;
		} catch (error) {
			console.error('Failed to fetch session day:', error);
			throw new Error('Failed to fetch session day');
		}
	},

	/**
	 * Get a session day with its sessions
	 */
	async getSessionDay(dayId: string) {
		try {
			const result = await sessionRepository.getSessionDay(dayId);
			return result;
		} catch (error) {
			console.error('Failed to fetch session day:', error);
			throw new Error('Failed to fetch session day');
		}
	},

	async updateFullSchedule(schedule: FullSessionSchedule): Promise<boolean> {
		if (!schedule) {
			throw new Error('No schedule provided');
		}

		return await sessionRepository.replaceAllSessions(schedule);
	},
};

export default sessionServices;
