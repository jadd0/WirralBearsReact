import { request } from '@/lib/network';
import { BlogData } from '@wirralbears/types';
import {
	Session,
	SessionDayWithSessions,
	SessionDay,
	SessionWithCoach,
	FullSessionSchedule,
} from '@wirralbears/backend-types';


/**
 * Gets all sessions
 * @returns An array of session objects
 */
export async function getAllSessions(): Promise<Session[]> {
  const { data } = await request({
    url: '/api/session/getAllSessions',
    method: 'GET',
  });
  return data.sessions;
}

/**
 * Creates a new session
 * @param sessionData - The data for the new session
 * @returns The created session object
 */
export async function createSession(sessionData: Session): Promise<boolean> {
  const { data } = await request({
    url: '/api/session/createSession',
    method: 'POST',
    data: sessionData,
  });
  return data.session;
}

/**
 * Updates an existing session
 * @param sessionData - The updated session data
 * @returns The updated session object
 */
export async function updateSession(sessionData: Session): Promise<boolean> {
  const { data } = await request({
    url: `/api/session/updateSesson/${sessionData.id}`,
    method: 'PUT',
    data: sessionData,
  });
  return data.session;
}

/**
 * Gets a single session by ID
 * @param id - The ID of the session
 * @returns The session object
 */
export async function getSessionById(id: string): Promise<Session> {
  const { data } = await request({
    url: `/api/session/getSession/${id}`,
    method: 'GET',
  });
  return data.session;
}

/**
 * Deletes a session by ID
 * @param id - The ID of the session to delete
 * @returns A success message or status
 */
export async function deleteSession(id: string): Promise<boolean> {
  const { data } = await request({
    url: `/api/session/deleteSession/${id}`,
    method: 'DELETE',
  });
  return data;
}

/**
 * Gets the full schedule
 * @returns The full schedule object
 */
export async function getFullSchedule(): Promise<FullSessionSchedule> {
  const { data } = await request({
    url: '/api/session/getFullSchedule',
    method: 'GET',
  });

  return data.schedule;
}

/**
 * Gets a full session day by ID
 * @param id - The ID of the session day
 * @returns The session day object
 */
export async function getSessionDay(id: string): Promise<SessionDayWithSessions> {
  const { data } = await request({
    url: `/api/session/getSessionDay/${id}`,
    method: 'GET',
  });
  return data.sessionDay;
}

/**
 * Updates entire schedule
 * @param id - The ID of the session day
 * @returns The session day object
 */
export async function updateFullSchedule(schedule: FullSessionSchedule): Promise<boolean> {
  const { data } = await request({
    url: `/api/session/updateFullSchedule`,
    method: 'PUT',
    data: schedule
  });
  return data;
}