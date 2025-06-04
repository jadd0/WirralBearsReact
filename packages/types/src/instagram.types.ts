export interface InstagramPost {
	id: string;
	caption?: string;
	media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
	media_url: string;
	thumbnail_url?: string;
	permalink: string;
	timestamp: string;
}

export interface TokenResponse {
	access_token: string;
	user_id: string;
	expires_in?: number;
}

export interface InstagramApiResponse {
	data: InstagramPost[];
	paging?: {
		cursors: {
			before: string;
			after: string;
		};
		next?: string;
	};
}

export interface AuthCallbackQuery {
	code?: string;
	error?: string;
	error_reason?: string;
	error_description?: string;
}