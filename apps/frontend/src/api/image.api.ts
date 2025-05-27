import { request } from '@/lib/network';

export async function getAllImages(cursor: number) {
	const { data } = await request({
		url: `/api/image/getAllImages/${cursor}`,
		method: 'GET',
	});

	return data;
}

export async function deleteImage(imageId: string) {
	const { data } = await request({
		url: `/api/image/deleteImage/${imageId}`,
		method: 'DELETE',
	});

	return data;
}
