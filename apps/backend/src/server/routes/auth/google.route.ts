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
router.get('/callback', (req: Request, res: Response, next) => {
	console.log('Google callback received');

	passport.authenticate('google', {
		failureRedirect: createClientURL('/login?error=unauthorised'), // Default failure
		failureMessage: true,
	})(req, res, (err: any) => {
		if (err) {
			console.error('Authentication error:', err);
			return res.redirect(createClientURL('/login?error=server_error'));
		}

		// Check if authentication failed (user not authorised)
		if (!req.user) {
			console.log('Authentication failed - user not authorised');
			return res.redirect(createClientURL('/login?error=unauthorised'));
		}

		// Authentication successful
		console.log('Google OAuth callback success');

		req.session.save((err) => {
			if (err) {
				console.error('Session save error:', err);
				return res.redirect(createClientURL('/login?error=server_error'));
			}
			console.log('Session saved, redirecting...');
			res.redirect(createClientURL('/admin'));
		});
	});
});

export default router;
