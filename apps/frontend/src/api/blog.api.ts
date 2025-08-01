import { request } from '@/lib/network';
import { BlogData } from '@wirralbears/types';
import { BlogPreview, FullBlog } from '@wirralbears/backend-types';

/**
 * Uploads multiple images and returns their data
 * @param files - Array of image files to upload
 * @param altTexts - Optional array of alt texts for the images
 * @returns Array of uploaded image data
 */
export async function uploadMultipleImages(
	files: File[],
	altTexts?: string[]
): Promise<{
	images: Array<{
		id: string;
		url: string;
		key: string;
		alt: string;
		originalName: string;
		index: number;
	}>;
	totalUploaded: number;
}> {
	const formData = new FormData();

	// Add each file to the FormData
	files.forEach((file) => {
		formData.append('images', file);
	});

	// Add alt texts if provided
	if (altTexts && altTexts.length > 0) {
		formData.append('altTexts', JSON.stringify(altTexts));
	}

	const { data } = await request({
		url: '/api/blog/uploadMultipleImages',
		method: 'POST',
		data: formData,
	});

	return data;
}

/**
 * Updates an existing blog on the server
 * @param data - Object containing blogData and id
 * @returns The ID of the updated blog
 */
export async function editBlogOnServer(data: {
	blogData: BlogData;
	id: string;
}) {
	const { blogData, id } = data;

	// Create a FormData object to handle both text data and files
	const formData = new FormData();

	// Track files that need to be uploaded
	const filesToUpload: { index: number; file: File }[] = [];

	// Process elements to identify files and prepare them for upload
	const processedElements = blogData.elements.map((element, index) => {
		// For image elements that have a file property
		if (
			element.type === 'image' &&
			'file' in element &&
			element.file instanceof File
		) {
			// Add to our tracking array
			filesToUpload.push({
				index,
				file: element.file,
			});

			// Return a clean version of the element without the file property
			// but with a reference to its position in the array
			const { file, localPreviewUrl, ...cleanElement } = element as any;
			return {
				...cleanElement,
				fileIndex: index, // Reference to identify which file belongs to this element
				position: element.position, // Ensure position is included
			};
		}

		// For other elements or images without files, return as is
		return element;
	});

	// Add each file to the FormData with a unique key
	filesToUpload.forEach(({ index, file }) => {
		formData.append(`file_${index}`, file);
	});

	// Add the processed elements JSON to the FormData
	formData.append('elements', JSON.stringify(processedElements));

	console.log('Editing blog with FormData:', formData);

	// Send the request with FormData
	const { data: responseData } = await request({
		url: `/api/blog/editBlog/${id}`,
		method: 'PUT',
		data: formData,
	});

	return responseData as { id: string };
}

/**
 * Saves a blog to the server
 * @returns The ID of the saved blog
 * @param blogData - The blog data to save
 */
export async function saveBlogToServer(blogData: BlogData) {
	// Create a FormData object to handle both text data and files
	const formData = new FormData();

	// Track files that need to be uploaded
	const filesToUpload: { index: number; file: File }[] = [];

	// Process elements to identify files and prepare them for upload
	const processedElements = blogData.elements.map((element, index) => {
		// For image elements that have a file property
		if (
			element.type === 'image' &&
			'file' in element &&
			element.file instanceof File
		) {
			// Add to our tracking array
			filesToUpload.push({
				index,
				file: element.file,
			});

			// Return a clean version of the element without the file property
			// but with a reference to its position in the array
			const { file, localPreviewUrl, ...cleanElement } = element as any;
			return {
				...cleanElement,
				fileIndex: index, // Reference to identify which file belongs to this element
				position: element.position, // Ensure position is included
			};
		}

		// For other elements or images without files, return as is
		return element;
	});

	// Add each file to the FormData with a unique key
	filesToUpload.forEach(({ index, file }) => {
		formData.append(`file_${index}`, file);
	});

	// Add the processed elements JSON to the FormData
	formData.append('elements', JSON.stringify(processedElements));

	console.log(formData);

	// Send the request with FormData
	const { data } = await request({
		url: '/api/blog/saveBlog',
		method: 'POST',
		data: formData,
	});

	return data as { id: string };
}

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
		method: 'DELETE',
	});

	return data;
}
