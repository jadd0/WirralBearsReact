import { Request, Response } from 'express';
import {
	getUserPosts,
	refreshAccessToken,
} from '../services/instagram.services';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
	const { limit = 3 } = req.query;
	const parsedLimit = Math.min(parseInt(limit as string, 10) || 3, 25); // Max 25 posts

	if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
		res.status(401).json({
			error: 'No access token available',
			message: 'Please authorize with Instagram first',
			auth_url: '/auth/instagram',
		});
		return;
	}

	try {
		console.log(`Fetching ${parsedLimit} Instagram posts...`);

		const posts = await getUserPosts(
			process.env.INSTAGRAM_ACCESS_TOKEN,
			parsedLimit
		);

		console.log(`Successfully fetched ${posts.length} posts`);

		res.json({
			success: true,
			count: posts.length,
			limit: parsedLimit,
			data: posts,
			user_id: process.env.INSTAGRAM_USER_ID,
		});
	} catch (error: any) {
		console.error('Failed to fetch Instagram posts:', error.message);

		if (error.message.includes('Invalid or expired access token')) {
			res.status(401).json({
				error: 'Invalid or expired access token',
				message: 'Please re-authorize with Instagram',
				auth_url: '/auth/instagram',
			});
		} else {
			res.status(500).json({
				error: 'Failed to fetch Instagram posts',
				details: error.message,
			});
		}
	}
};

export const getRefreshToken = async (
	req: Request,
	res: Response
): Promise<void> => {
	if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
		res.status(401).json({
			error: 'No access token to refresh',
			message: 'Please authorize with Instagram first',
			auth_url: '/auth/instagram',
		});
		return;
	}

	try {
		console.log('Refreshing Instagram access token...');

		const refreshedToken = await refreshAccessToken(
			process.env.INSTAGRAM_ACCESS_TOKEN
		);

		// Update stored token
		process.env.INSTAGRAM_ACCESS_TOKEN = refreshedToken.access_token;

		console.log('Token refreshed successfully');

		const expirationDate = new Date();
		expirationDate.setSeconds(
			expirationDate.getSeconds() + (refreshedToken.expires_in || 5184000)
		);

		res.json({
			success: true,
			message: 'Access token refreshed successfully',
			expires_in: refreshedToken.expires_in,
			expires_at: expirationDate.toISOString(),
		});
	} catch (error: any) {
		console.error('Token refresh failed:', error.message);
		res.status(500).json({
			error: 'Failed to refresh access token',
			details: error.message,
			suggestion: 'You may need to re-authorize with Instagram',
		});
	}
};

export const getHealth = (req: Request, res: Response): void => {
	const hasToken = !!process.env.INSTAGRAM_ACCESS_TOKEN;
	const hasUserId = !!process.env.INSTAGRAM_USER_ID;

	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development',
		instagram: {
			authenticated: hasToken && hasUserId,
			has_access_token: hasToken,
			has_user_id: hasUserId,
			user_id: hasUserId ? process.env.INSTAGRAM_USER_ID : null,
		},
		server: {
			uptime: process.uptime(),
			memory_usage: process.memoryUsage(),
			node_version: process.version,
		},
	});
};
