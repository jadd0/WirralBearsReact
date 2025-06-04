import axios from 'axios';
import {
	InstagramPost,
	TokenResponse,
	InstagramApiResponse,
} from '@/types/instagram.types';

export const exchangeCodeForToken = async (
	code: string
): Promise<TokenResponse> => {
	try {
		const response = await axios.post(
			'https://api.instagram.com/oauth/access_token',
			{
				client_id: process.env.INSTAGRAM_CLIENT_ID,
				client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
				grant_type: 'authorization_code',
				redirect_uri: process.env.REDIRECT_URI,
				code: code,
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		return response.data;
	} catch (error: any) {
		throw new Error(
			`Token exchange failed: ${
				error.response?.data?.error_message || error.message
			}`
		);
	}
};

export const exchangeForLongLivedToken = async (
	shortLivedToken: string
): Promise<TokenResponse> => {
	try {
		const response = await axios.get(
			`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortLivedToken}`
		);

		return {
			access_token: response.data.access_token,
			user_id: '',
			expires_in: response.data.expires_in,
		};
	} catch (error: any) {
		throw new Error(
			`Long-lived token exchange failed: ${
				error.response?.data?.error?.message || error.message
			}`
		);
	}
};

export const getUserPosts = async (
	accessToken: string,
	limit: number = 3
): Promise<InstagramPost[]> => {
	try {
		const response = await axios.get<InstagramApiResponse>(
			`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}&limit=${limit}`
		);

		return response.data.data;
	} catch (error: any) {
		if (error.response?.status === 401) {
			throw new Error('Invalid or expired access token');
		}
		throw new Error(
			`Failed to fetch posts: ${
				error.response?.data?.error?.message || error.message
			}`
		);
	}
};

export const refreshAccessToken = async (
	accessToken: string
): Promise<TokenResponse> => {
	try {
		const response = await axios.get(
			`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`
		);

		return {
			access_token: response.data.access_token,
			user_id: '',
			expires_in: response.data.expires_in,
		};
	} catch (error: any) {
		throw new Error(
			`Token refresh failed: ${
				error.response?.data?.error?.message || error.message
			}`
		);
	}
};

export const generateAuthUrl = (): string => {
	return `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
};
