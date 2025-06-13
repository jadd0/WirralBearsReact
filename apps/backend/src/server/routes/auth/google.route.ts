import { createClientURL } from '@/lib/utils';
import { Router, Request, Response } from 'express';
import passport from 'passport';

const router: Router = Router();

/**
 * /auth/google
 *
 * Google OAuth route with enhanced configuration
 */
router.get(
	'/',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		accessType: 'offline',
		prompt: 'consent',
	})
);

/**
 * /auth/google/callback
 *
 * Google OAuth callback route with better error handling
 */
router.get(
	'/callback',
	passport.authenticate('google', {
		failureRedirect: createClientURL('/login?error=auth_failed'),
		failureMessage: true,
	}),
	(req: Request, res: Response) => {
		console.log('Google OAuth callback success:', {
			authenticated: req.isAuthenticated(),
			user: req.user?.id || 'none',
			sessionID: req.sessionID,
			cookies: req.headers.cookie ? 'present' : 'missing',
		});

		// Ensure user is authenticated before proceeding
		if (!req.isAuthenticated() || !req.user) {
			console.error('Authentication failed in callback');
			return res.redirect(createClientURL('/login?error=auth_failed'));
		}

		// Force session save with proper error handling
		req.session.save((err) => {
			if (err) {
				console.error('Session save error:', err);
				return res.redirect(createClientURL('/login?error=session_failed'));
			}

			console.log('Session saved successfully:', {
				sessionID: req.sessionID,
				userID: req.user?.id,
				timestamp: new Date().toISOString(),
			});

			// Add a small delay to ensure PostgreSQL commit completes
			setTimeout(() => {
				res.redirect(createClientURL('/'));
			}, 100);
		});
	}
);

export default router;
