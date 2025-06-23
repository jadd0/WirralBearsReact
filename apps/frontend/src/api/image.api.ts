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

export async function getAllFirstCarouselImages() {
	const { data } = await request({
		url: `/api/image/getAllFirstCarouselImages`,
		method: 'GET',
	});

	console.log({data})

	return data;
}

export async function getAllB4ACarouselImages() {
	const { data } = await request({
		url: `/api/image/getAllB4ACarouselImages`,
		method: 'GET',
	});

	return data;
}

export async function replaceAllFirstCarouselImages(
	images: {
		imageId: string;
		key: string;
	}[]
) {
	console.log(images)
	const { data } = await request({
		url: `/api/image/replaceAllFirstCarouselImages`,
		method: 'PUT',
		data: images,
	});

	return data;
}

export async function replaceAllB4ACarouselImages(
	images: {
		imageId: string;
		key: string;
	}[]
) {
	const { data } = await request({
		url: `/api/image/replaceAllB4ACarouselImages`,
		method: 'PUT',
		data: images,
	});

	return data;
}