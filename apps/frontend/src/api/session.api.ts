import { request } from '@/lib/network';
import { BlogData } from '@wirralbears/types';
import { BlogPreview, FullBlog } from '@wirralbears/backend-types';

/**
 * Fetches a blog by its ID
 * @param id - The ID of the blog to fetch
 * @returns The blog data
 */
export async function fetchBlog(id: string) {
	const { data } = await request({
		url: `/api/blog/getBlog/${id}`,
		method: 'GET',
	});

	return data.blog as FullBlog;
}

/**
 * Uploads a single image file and returns the URL
 * @param file - The image file to upload
 * @returns The URL of the uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
	const formData = new FormData();
	formData.append('image', file);

	const { data } = await request({
		url: '/api/blog/uploadImage',
		method: 'POST',
		data: formData,
	});

	return data.url;
}

export async function getAllBlogPreviews(): Promise<BlogPreview[]> {
	const { data } = await request({
		url: `/api/blog/getAllBlogPreviews`,
		method: 'GET',
	});

	return data.blogs as BlogPreview[];
}

export async function deleteBlog(id: string) {
	const { data } = await request({
		url: `/api/blog/deleteBlog/${id}`,
		method: 'DELETE'
	})

	return data;
}
