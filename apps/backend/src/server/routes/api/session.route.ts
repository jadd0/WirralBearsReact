import { Router } from 'express';
import * as sessionControllers from '../../controllers/session.controllers';
import { ensureAuthenticated } from '@/server/middleware/auth.middleware';
import multer from 'multer';
import { session } from 'passport';

const router: Router = Router();
const upload = multer();

// GET all sessions
router.get('/getAllSessions', sessionControllers.getAllSessions);

// POST create a new session
router.post(
	'/createSession',
	ensureAuthenticated,
	sessionControllers.createSession
);

// PUT (update) an existing session
router.put(
	'/updateSesson/:id',
	ensureAuthenticated,
	sessionControllers.updateSession
);

// GET a single session by ID
router.get(
	'/getSession/:id',
	sessionControllers.getSessionById
);

// DELETE a session
router.delete(
	'/deleteSession/:id',
	ensureAuthenticated,
	sessionControllers.deleteSession
);

// GET full schedule
router.get(
	'/getFullSchedule',
	sessionControllers.getFullSchedule
);

// GET a full session day
router.get('/getSessionDay/:id', sessionControllers.getSessionDay);


export default router;
