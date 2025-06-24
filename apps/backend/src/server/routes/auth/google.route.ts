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
 * Google OAuth callback route with proper failure handling
 */
router.get(
	'/callback',
	(req: Request, res: Response, next) => {
		console.log('Google callback received');
		
		passport.authenticate('google', {
			failureRedirect: createClientURL('/login?error=auth_failed'),
			failureMessage: true,
		})(req, res, (err) => {
			if (err) {
				console.error('Authentication error:', err);
				return res.redirect(createClientURL('/login?error=server_error'));
			}
			
			// Check if authentication failed (user not authorized)
			if (!req.user) {
				console.log('Authentication failed - user not authorized');
				return res.redirect(createClientURL('/login?error=unauthorized'));
			}
			
			// Authentication successful
			console.log('Google OAuth callback success:', {
				authenticated: req.isAuthenticated(),
				user: req.user?.id || 'none',
				sessionID: req.sessionID,
				cookies: req.headers.cookie ? 'present' : 'missing',
			});

			// Force session save before redirect
			req.session.save((err) => {
				if (err) {
					console.error('Session save error:', err);
				}
				console.log('Session saved, redirecting...');
				res.redirect(createClientURL('/admin'));
			});
		});
	}
);

export default router;
