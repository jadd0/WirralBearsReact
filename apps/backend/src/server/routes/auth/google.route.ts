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
		console.log('OAuth callback - before save:', {
			authenticated: req.isAuthenticated(),
			user: req.user?.id || 'none',
			sessionID: req.sessionID,
			cookies: req.headers.cookie ? 'present' : 'missing',
		});

		if (!req.isAuthenticated() || !req.user) {
			console.error('Authentication failed in callback');
			return res.redirect(createClientURL('/login?error=auth_failed'));
		}

		// Force session regeneration to avoid race conditions
		req.session.regenerate((err) => {
			if (err) {
				console.error('Session regeneration error:', err);
				return res.redirect(createClientURL('/login?error=session_failed'));
			}

			// Re-login user after regeneration
			req.logIn(req.user!, (err) => {
				if (err) {
					console.error('Login error after regeneration:', err);
					return res.redirect(createClientURL('/login?error=login_failed'));
				}

				// Force session save with longer timeout
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

					// Add delay to ensure PostgreSQL commit completes
					setTimeout(() => {
						res.redirect(createClientURL('/dashboard?auth=success'));
					}, 200);
				});
			});
		});
	}
);

export default router;
