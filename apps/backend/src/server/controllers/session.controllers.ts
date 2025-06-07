import { RequestHandler, Request, Response } from 'express';
import { sessionServices } from '../services/session.services';
import { Session } from '@wirralbears/types';

export const getAllSessions: RequestHandler = async (req, res) => {
	try {
		const sessions = await sessionServices.getAllSessions();
		res.status(200).send({ sessions });
	} catch (error) {
		console.error('Error fetching sessions:', error);
		res.status(500).send({
			message: 'Failed to fetch sessions',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const createSession: RequestHandler = async (req, res) => {
	try {
		const sessionData: Session = {
			...req.body,
		};

		const newSession = await sessionServices.createSession(sessionData);
		res.status(201).send({
			session: newSession,
			message: 'Session created successfully',
		});
	} catch (error) {
		console.error('Error creating session:', error);
		res.status(500).send({
			message: 'Failed to create session',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const updateSession: RequestHandler = async (req, res) => {
	const { id } = req.params;

	try {
		const existingSession = await sessionServices.getSession(id);

		if (!existingSession) {
			res.status(404).send({
				message: `No such session with id ${id}`,
			});
		}

		const updates = req.body;
		const updatedSession = await sessionServices.updateSession(id, updates);
		res.status(200).send({
			session: updatedSession,
			message: 'Session updated successfully',
		});
	} catch (error) {
		console.error('Error updating session:', error);
		res.status(500).send({
			message: 'Failed to update session',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const deleteSession: RequestHandler = async (req, res) => {
	const { id } = req.params;

	try {
		const existingSession = await sessionServices.getSession(id);

		await sessionServices.deleteSession(id);
		res.status(200).send({ message: 'Session deleted successfully' });
	} catch (error) {
		console.error('Error deleting session:', error);
		res.status(500).send({
			message: 'Failed to delete session',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const getSessionById: RequestHandler = async (req, res) => {
	const { id } = req.params;

	try {
		const session = await sessionServices.getSession(id);

		if (session) {
			res.status(200).send({ session });
		} else {
			res.status(404).send({ message: 'Session not found' });
		}
	} catch (error) {
		console.error('Error fetching session:', error);
		res.status(500).send({
			message: 'Failed to fetch session',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const getFullSchedule: RequestHandler = async (req, res) => {
	try {
		const schedule = await sessionServices.getFullSchedule();
		res.status(200).send({ schedule });
	} catch (error) {
		console.error('Error fetching schedule:', error);
		res.status(500).send({
			message: 'Failed to fetch schedule',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const getSessionDay: RequestHandler = async (req, res) => {
	const { id } = req.params;

	try {
		const sessionDay = await sessionServices.getSessionDay(id);
		res.status(200).send({ sessionDay });
	} catch (error) {
		console.error('Error fetching session day:', error);
		res.status(500).send({
			message: 'Failed to fetch session day',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const updateFullSchedule: RequestHandler = async (req, res) => {
	const schedule = req.body;

	if (!schedule) {
		res.status(400).send({ message: 'No schedule provided to update' });
	}

	try {
		const result = await sessionServices.updateFullSchedule(schedule);
    res.status(200).send({ success: result }); 
		} catch (error) {
		res.status(500).send({
			message: 'Error trying to update session schedule',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export default {
	getAllSessions,
	createSession,
	updateSession,
	deleteSession,
	getSessionById,
	getFullSchedule,
	getSessionDay,
	updateFullSchedule,
} as {};
