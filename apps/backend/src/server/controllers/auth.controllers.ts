import { RequestHandler } from 'express';
import { AuthCallbackQuery } from '@wirralbears/types/src/instagram.types';
import {
	exchangeCodeForToken,
	exchangeForLongLivedToken,
	generateAuthUrl,
} from '../services/instagram.services';

/**
 * Return details of the status of authentication for the client
 */
export const me: RequestHandler = async (req, res, next) => {
	if (req.isAuthenticated())
		res.status(200).send({ authenticated: true, user: req.user });
	else
		res
			.status(200)
			.send({ authenticated: false, message: 'Not authenticated' });
};

/**
 * Log out the user if they are authenticated
 */
export const logout: RequestHandler = async (req, res) => {
	req.logout((err) => {
		if (err) {
			res.status(500).send({ message: 'Failed to log out' });
		} else
			req.session.destroy((sessionErr) => {
				if (sessionErr) res.status(500).send({ message: 'Failed to log out' });
				else {
					res.clearCookie('connect.sid');
					res.status(204).send(); // TODO: redirect to login page or home page
				}
			});
	});
};

export const initiateInstagramAuth: RequestHandler = (req, res) => {
	try {
		const authUrl = generateAuthUrl();
		console.log('Redirecting to Instagram OAuth:', authUrl);
		res.redirect(authUrl);
	} catch (error: any) {
		console.error('Auth initiation failed:', error.message);
		res.status(500).json({
			error: 'Failed to initiate Instagram authorization',
			message: error.message,
		});
	}
};

export const handleInstagramCallback: RequestHandler = async (req, res) => {
	const { code, error, error_reason, error_description } =
		req.query as AuthCallbackQuery;

	// Handle OAuth errors
	if (error) {
		console.error('Instagram OAuth error:', {
			error,
			error_reason,
			error_description,
		});
		res.status(500).send({ message: 'Instagram auth error' });
		return;
	}

	// Validate authorization code
	if (!code || typeof code !== 'string') {
		res.status(400).json({
			error: 'No authorization code received',
			message: 'Instagram did not provide a valid authorization code',
		});
		return;
	}

	try {
		console.log('Processing Instagram authorization callback...');
		console.log('Authorization code received:', code.substring(0, 10) + '...');

		// Step 1: Exchange authorization code for short-lived token
		console.log('Exchanging code for short-lived access token...');
		const shortLivedToken = await exchangeCodeForToken(code);

		if (!shortLivedToken.access_token) {
			throw new Error('No access token received from Instagram');
		}

		console.log('Short-lived token obtained successfully');
		console.log('User ID:', shortLivedToken.user_id);

		// Step 2: Exchange short-lived token for long-lived token
		console.log('Exchanging for long-lived access token...');
		const longLivedToken = await exchangeForLongLivedToken(
			shortLivedToken.access_token
		);

		if (!longLivedToken.access_token) {
			throw new Error('Failed to obtain long-lived token');
		}

		console.log('Long-lived token obtained successfully');
		console.log('Token expires in:', longLivedToken.expires_in, 'seconds');

		// Store tokens securely (in production, use database)
		process.env.INSTAGRAM_ACCESS_TOKEN = longLivedToken.access_token;
		process.env.INSTAGRAM_USER_ID = shortLivedToken.user_id;

		// Calculate expiration date
		const expirationDate = new Date();
		expirationDate.setSeconds(
			expirationDate.getSeconds() + (longLivedToken.expires_in || 5184000)
		); // Default 60 days

		res.json({
			success: true,
			message: 'Instagram authorization completed successfully',
			data: {
				user_id: shortLivedToken.user_id,
				token_expires_in: longLivedToken.expires_in,
				token_expires_at: expirationDate.toISOString(),
				scope: 'user_profile,user_media',
			},
		});
	} catch (error: any) {
		console.error('Instagram authorization failed:', error.message);

		// Provide specific error messages based on error type
		let errorMessage = 'Failed to complete Instagram authorization';
		let statusCode = 500;

		if (error.message.includes('Token exchange failed')) {
			errorMessage = 'Failed to exchange authorization code for access token';
			statusCode = 400;
		} else if (error.message.includes('Long-lived token exchange failed')) {
			errorMessage = 'Failed to obtain long-lived access token';
			statusCode = 500;
		}

		res.status(statusCode).json({
			error: errorMessage,
			details: error.message,
			suggestion: 'Please try the authorization process again',
		});
	}
};

export const getInstagramAuthStatus: RequestHandler = (req, res) => {
	const hasToken = !!process.env.INSTAGRAM_ACCESS_TOKEN;
	const hasUserId = !!process.env.INSTAGRAM_USER_ID;

	res.json({
		authenticated: hasToken && hasUserId,
		has_access_token: hasToken,
		has_user_id: hasUserId,
		user_id: hasUserId ? process.env.INSTAGRAM_USER_ID : null,
		message:
			hasToken && hasUserId
				? 'Instagram account is connected'
				: 'Instagram account not connected. Visit /auth/instagram to authorize.',
	});
};

export default {
	me,
	logout,
} as {
	me: RequestHandler;
	logout: RequestHandler;
};
