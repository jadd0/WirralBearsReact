import { coachRepository } from '../repositories/coach.repo';
import { imageRepository } from '../repositories/images.repo';
import { Coaches } from '@/db/schemas/coach.schema';
import {
	BlogData,
	HeadingElement,
	ImageElement,
	ParagraphElement,
} from '@wirralbears/types';
import { uploadPostImages } from './image.services';

export const coachServices = {
	async getAllCoaches() {
		return coachRepository.findAll();
	},
	async updateCoach(
		coachId: string,
		authorId: string,
		coachData: BlogData,
		files?: Express.Multer.File[]
	): Promise<Coaches | null> {
		// First, verify the coach exists
		const existingCoach = await coachRepository.getCoachById(coachId);

		if (!existingCoach) {
			return null;
		}

		const headings: HeadingElement[] = [];
		const paragraphs: ParagraphElement[] = [];
		const imageElements: (ImageElement & { fileIndex?: number })[] = [];

		// Sort elements by position and categorize them
		coachData.elements.forEach((element) => {
			switch (element.type) {
				case 'heading':
					headings.push(element as HeadingElement);
					break;
				case 'paragraph':
					paragraphs.push(element as ParagraphElement);
					break;
				case 'image':
					// Include fileIndex if it exists
					const imageElement = element as ImageElement & { fileIndex?: number };
					imageElements.push(imageElement);
					break;
			}
		});

		// Extract title from the first heading or keep existing title
		const title = headings.length > 0 ? headings[0].text : existingCoach.title;

		// Process and upload new images if there are any
		let imageReferences: { imageId: string; position: number }[] = [];

		// Handle existing images (those with URLs but no files)
		for (const imageElement of imageElements) {
			if (imageElement.url && !('fileIndex' in imageElement)) {
				// This is an existing image, find its ID from the database
				const existingImage = existingCoach.images?.find(
					(img) => img.url === imageElement.url
				);

				if (existingImage) {
					imageReferences.push({
						imageId: existingImage.id || '',
						position: imageElement.position ?? 0,
					});
				}
			}
		}

		// Handle new image uploads
		if (files && files.length > 0) {
			const fileObjects = files.map((file) => {
				return new File([file.buffer], file.originalname, {
					type: file.mimetype,
				});
			});

			const uploadResult = await uploadPostImages(fileObjects);

			if (uploadResult.successes.length > 0) {
				for (let i = 0; i < uploadResult.successes.length; i++) {
					const uploadedImage = uploadResult.successes[i];

					if (!uploadedImage) {
						throw new Error('Upload succeeded but no image data was returned');
					}

					// Find the matching element by fileIndex
					const matchingElement = imageElements.find(
						(el) => el.fileIndex === i
					);

					const position = matchingElement?.position || i;
					const alt = matchingElement?.alt || `Image ${i + 1}`;

					const image = await imageRepository.createImage({
						key: uploadedImage.key,
						authorId: authorId,
						url: uploadedImage.url,
						alt,
					});

					imageReferences.push({
						imageId: image.id,
						position: position,
					});
				}
			}
		}

		// Use the repository to update the coach with all its components
		return await coachRepository.updateCoachWithTransaction(
			coachId,
			title,
			headings,
			paragraphs,
			imageReferences
		);
	},

	async getCoachById(id: string) {
		const coach = await coachRepository.getCoachById(id);

		if (!coach) {
			throw new Error('Coach not found');
		}
		return coach;
	},

	// TODO: finish image upload on next pull request
	async uploadSingleImage(authorId: string, file: Express.Multer.File) {
		try {
			// Convert the Multer file to a Blob
			const fileBuffer = file.buffer;
			const fileName = file.originalname;
			const fileType = file.mimetype;

			// Generate a clean filename to use as ID (remove extension and special chars)
			const fileId = fileName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');

			// Create a Blob from the buffer
			const blobData = new Blob([fileBuffer], { type: fileType });

			// Create a File object from the Blob
			const fileObject = new File([blobData], fileName, { type: fileType });

			// Upload the image
			const uploadResult = await uploadPostImages([fileObject]);

			if (uploadResult.failures > 0 || uploadResult.successes.length === 0) {
				console.error('Upload failed:', uploadResult);
				throw new Error('Failed to upload image');
			}

			// Get the uploaded image data
			const uploadedImage = uploadResult.successes[0];

			if (!uploadedImage) {
				throw new Error('Upload succeeded but no image data was returned');
			}

			// Store the image record in the database using the repository with the same ID
			const image = await imageRepository.createImage({
				id: fileId,
				key: uploadedImage.key,
				authorId: authorId,
				url: uploadedImage.url,
			});

			return {
				imageId: image.id,
				url: uploadedImage.url,
				key: uploadedImage.key,
			};
		} catch (error) {
			console.error('Complete upload error:', error);
			throw error;
		}
	},

	async createCoach(
		authorId: string,
		coachData: BlogData,
		files?: Express.Multer.File[]
	): Promise<Coaches> {
		const headings: HeadingElement[] = [];
		const paragraphs: ParagraphElement[] = [];
		const imageElements: (ImageElement & { fileIndex?: number })[] = [];

		// Sort elements by position and categorize them
		coachData.elements.forEach((element) => {
			switch (element.type) {
				case 'heading':
					headings.push(element as HeadingElement);
					break;
				case 'paragraph':
					paragraphs.push(element as ParagraphElement);
					break;
				case 'image':
					// Include fileIndex if it exists
					const imageElement = element as ImageElement & { fileIndex?: number };
					imageElements.push(imageElement);
					break;
			}
		});

		// Extract title from the first heading or use default
		const title = headings.length > 0 ? headings[0].text : 'Untitled Coach';

		// Process and upload images if there are any
		let imageReferences: { imageId: string; position: number }[] = [];

		if (files && files.length > 0) {
			const fileObjects = files.map((file) => {
				return new File([file.buffer], file.originalname, {
					type: file.mimetype,
				});
			});

			const uploadResult = await uploadPostImages(fileObjects);

			if (uploadResult.successes.length > 0) {
				for (let i = 0; i < uploadResult.successes.length; i++) {
					const uploadedImage = uploadResult.successes[i];

					if (!uploadedImage) {
						throw new Error('Upload succeeded but no image data was returned');
					}

					// Find the matching element by fileIndex
					const matchingElement = imageElements.find(
						(el) => el.fileIndex === i
					);

					console.log(`Looking for fileIndex: ${i}, found:`, matchingElement);

					const position = matchingElement?.position || i;
					const alt = matchingElement?.alt || `Image ${i + 1}`; // Provide fallback

					console.log('alt:', alt);

					const image = await imageRepository.createImage({
						key: uploadedImage.key,
						authorId: authorId,
						url: uploadedImage.url,
						alt,
					});

					imageReferences.push({
						imageId: image.id,
						position: position,
					});
				}
			}
		}

		// Use the repository to create the coach with all its components
		return await coachRepository.createCoachWithTransaction(
			title,
			authorId,
			headings,
			paragraphs,
			imageReferences
		);
	},

	async deleteCoach(id: string): Promise<boolean> {
		const deleted = await coachRepository.deleteCoach(id);
		if (!deleted) {
			throw new Error('Coach not found or could not be deleted');
		}
		return true;
	},
};

// Helper function to extract title from coach data
function extractTitle(coachData: BlogData): string {
	// Find the first heading element to use as title
	const headingElement = coachData.elements.find((el) => el.type === 'heading');
	if (headingElement && 'text' in headingElement) {
		return headingElement.text;
	}
	return 'Untitled Coach';
}

export default coachServices;
