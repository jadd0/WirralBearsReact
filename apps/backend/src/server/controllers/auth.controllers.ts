import { RequestHandler } from 'express';

/**
 * Return details of the status of authentication for the client
 */
export const me: RequestHandler = async (req, res, next) => {
	console.log('Auth /me endpoint called:', {
		authenticated: req.isAuthenticated(),
		user: req.user?.id || 'none',
		sessionID: req.sessionID,
		cookies: req.headers.cookie ? 'present' : 'missing',
		session: req.session,
	});

	if (req.isAuthenticated()) {
		res.status(200).send({
			authenticated: true,
			user: req.user,
		});
	} else {
		res.status(200).send({
			authenticated: false,
			message: 'Not authenticated',
		});
	}
};

/**
 * Log out the user if they are authenticated
 */
export const logout: RequestHandler = async (req, res) => {
	console.log('Logout attempt:', {
		authenticated: req.isAuthenticated(),
		user: req.user?.id || 'none',
		sessionID: req.sessionID,
	});

	req.logout((err) => {
		if (err) {
			console.error('Logout error:', err);
			res.status(500).send({ message: 'Failed to log out' });
		} else {
			req.session.destroy((sessionErr) => {
				if (sessionErr) {
					console.error('Session destroy error:', sessionErr);
					res.status(500).send({ message: 'Failed to log out' });
				} else {
					res.clearCookie('connect.sid');
					console.log('Logout successful');
					res.status(204).send();
				}
			});
		}
	});
};

export default {
	me,
	logout,
} as {
	me: RequestHandler;
	logout: RequestHandler;
};
