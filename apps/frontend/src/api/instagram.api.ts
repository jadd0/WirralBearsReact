import { request } from '@/lib/network';

export async function getInstagramPosts(limit: number) {
	const { data } = await request({
		url: `/api/instagram/posts?limit=${limit}`,
		method: 'GET',
	});

	return data;
}

export async function refreshInstagramToken() {
	const { data } = await request({
		url: `/api/instagram/refreshToken`,
		method: 'POST',
	});

	return data;
}

// export async function getInstagramAuthStatus() {
// 	const { data } = await request({
// 		url: `/api/image/getAllImages/${cursor}`,
// 		method: 'GET',
// 	});

// 	return data;
// }
