import { Request, Response, NextFunction } from 'express';

export const ensureAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log('ensureAuthenticated check:', {
		authenticated: req.isAuthenticated(),
		user: req.user?.id || 'none',
		sessionID: req.sessionID,
		url: req.url,
		cookies: req.headers.cookie ? 'present' : 'missing',
	});

	if (req.isAuthenticated()) {
		return next();
	}

	res.status(401).json({
		message: 'Authentication required',
		authenticated: false,
	});
};

export const ensureUnauthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log('ensureUnauthenticated check:', {
		authenticated: req.isAuthenticated(),
		user: req.user?.id || 'none',
		sessionID: req.sessionID,
		url: req.url,
		cookies: req.headers.cookie ? 'present' : 'missing',
	});

	if (!req.isAuthenticated()) {
		return next();
	}

	res.status(403).json({
		message: 'Already authenticated',
		authenticated: true,
	});
};
