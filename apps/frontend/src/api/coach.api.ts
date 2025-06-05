import { request } from '@/lib/network';
import { BlogData } from '@wirralbears/types';
import { CoachPreview, FullCoach } from '@wirralbears/backend-types';

/**
 * Updates an existing coach on the server
 * @param data - Object containing coachData and id
 * @returns The ID of the updated coach
 */
export async function editCoachOnServer(data: {
	coachData: BlogData;
	id: string;
}) {
	const { coachData, id } = data;

	// Create a FormData object to handle both text data and files
	const formData = new FormData();

	// Track files that need to be uploaded
	const filesToUpload: { index: number; file: File }[] = [];

	// Process elements to identify files and prepare them for upload
	const processedElements = coachData.elements.map((element, index) => {
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

	console.log('Editing coach with FormData:', formData);

	// Send the request with FormData
	const { data: responseData } = await request({
		url: `/api/coach/editCoach/${id}`,
		method: 'PUT',
		data: formData,
	});

	return responseData as { id: string };
}

/**
 * Saves a coach to the server
 * @returns The ID of the saved coach
 * @param coachData - The coach data to save
 */
export async function saveCoachToServer(coachData: BlogData) {
	// Create a FormData object to handle both text data and files
	const formData = new FormData();

	// Track files that need to be uploaded
	const filesToUpload: { index: number; file: File }[] = [];

	// Process elements to identify files and prepare them for upload
	const processedElements = coachData.elements.map((element, index) => {
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
		url: '/api/coach/saveCoach',
		method: 'POST',
		data: formData,
	});

	return data as { id: string };
}

/**
 * Fetches a coach by its ID
 * @param id - The ID of the coach to fetch
 * @returns The coach data
 */
export async function fetchCoach(id: string) {
	console.log("dhfkjh")
	const { data } = await request({
		url: `/api/coach/getCoach/${id}`,
		method: 'GET',
	});

	console.log({data})

	return data.coach as FullCoach;
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
		url: '/api/coach/uploadImage',
		method: 'POST',
		data: formData,
	});

	return data.url;
}

export async function getAllCoachPreviews(): Promise<CoachPreview[]> {
	const { data } = await request({
		url: `/api/coach/getAllCoachPreviews`,
		method: 'GET',
	});

	return data.coaches as CoachPreview[];
}

export async function deleteCoach(id: string) {
	const { data } = await request({
		url: `/api/coach/deleteCoach/${id}`,
		method: 'DELETE'
	})

	return data;
}
