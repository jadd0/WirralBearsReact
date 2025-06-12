import { blogRepository } from '../repositories/blog.repo';
import { imageRepository } from '../repositories/images.repo';
import { Blog } from '../../db/schema';
import {
	BlogData,
	HeadingElement,
	ImageElement,
	ParagraphElement,
} from '@wirralbears/types';
import { uploadPostImages } from './image.services';

export const blogServices = {
	async getAllBlogs() {
		return blogRepository.findAll();
	},
	async updateBlog(
		blogId: string,
		authorId: string,
		blogData: BlogData,
		files?: Express.Multer.File[]
	): Promise<Blog | null> {
		// First, verify the blog exists and the user owns it
		const existingBlog = await blogRepository.getBlogById(blogId);
		if (!existingBlog || existingBlog.authorId !== authorId) {
			return null;
		}

		const headings: HeadingElement[] = [];
		const paragraphs: ParagraphElement[] = [];
		const imageElements: (ImageElement & { fileIndex?: number })[] = [];

		// Sort elements by position and categorize them
		blogData.elements.forEach((element) => {
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
		const title = headings.length > 0 ? headings[0].text : existingBlog.title;

		// Process and upload new images if there are any
		let imageReferences: { imageId: string; position: number }[] = [];

		// Handle existing images (those with URLs but no files)
		for (const imageElement of imageElements) {
			if (imageElement.url && !('fileIndex' in imageElement)) {
				// This is an existing image, find its ID from the database
				const existingImage = existingBlog.images?.find(
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

		// Use the repository to update the blog with all its components
		return await blogRepository.updateBlogWithTransaction(
			blogId,
			title,
			headings,
			paragraphs,
			imageReferences
		);
	},

	/**
	 * Upload multiple images independently (not associated with any blog)
	 *
	 * @param authorId - The ID of the user uploading the images
	 * @param files - Array of Express.Multer.File objects to upload
	 * @param altTexts - Optional array of alt texts for the images (should match files array length)
	 * @returns Promise containing uploaded image data with database records
	 */
	async uploadMultipleImages(
		files: Express.Multer.File[],
		authorId: string,
		altTexts?: string[]
	) {
		try {
			// Validate input
			if (!files || files.length === 0) {
				throw new Error('No files provided for upload');
			}

			if (altTexts && altTexts.length !== files.length) {
				throw new Error('Alt texts array length must match files array length');
			}

			// Convert Multer files to File objects (same pattern as your existing methods)
			const fileObjects = files.map((file) => {
				return new File([file.buffer], file.originalname, {
					type: file.mimetype,
				});
			});

			// Upload images using existing uploadPostImages service
			const uploadResult = await uploadPostImages(fileObjects);

			if (uploadResult.failures > 0 || uploadResult.successes.length === 0) {
				throw new Error(
					`Failed to upload images. Failures: ${uploadResult.failures}`
				);
			}

			// Create database records for successfully uploaded images
			const databaseImages: Array<{
				id: any;
				url: any;
				key: any;
				alt: string;
				originalName: any;
				index: number;
			}> = [];

			const failedDatabaseInserts: Array<{
				index: number;
				error: string;
			}> = [];

			for (let i = 0; i < uploadResult.successes.length; i++) {
				const uploadedImage = uploadResult.successes[i];

				if (!uploadedImage) {
					failedDatabaseInserts.push({
						index: i,
						error: 'Upload succeeded but no image data was returned',
					});
					continue;
				}

				try {
					const alt = altTexts?.[i] || `Image ${i + 1}`;

					// Use the same imageRepository.createImage pattern as your other methods
					const image = await imageRepository.createImage({
						key: uploadedImage.key,
						url: uploadedImage.url,
						alt,
						authorId
					});

					databaseImages.push({
						id: image.id,
						url: uploadedImage.url,
						key: uploadedImage.key,
						alt: alt,
						originalName: files[i].originalname,
						index: i,
					});
				} catch (dbError) {
					console.error(
						`Failed to create database record for image ${i}:`,
						dbError
					);
					failedDatabaseInserts.push({
						index: i,
						error:
							dbError instanceof Error
								? dbError.message
								: 'Unknown database error',
					});
				}
			}

			return {
				successes: databaseImages,
				failures: failedDatabaseInserts,
				totalUploaded: uploadResult.successes.length,
				totalProcessed: files.length,
				cloudUploadFailures: uploadResult.failures,
			};
		} catch (error) {
			console.error('Error in uploadMultipleImages:', error);
			throw error;
		}
	},

	async getBlogById(id: string) {
		const blog = await blogRepository.getBlogById(id);

		if (!blog) {
			throw new Error('Blog not found');
		}
		return blog;
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

	async createBlog(
		authorId: string,
		blogData: BlogData,
		files?: Express.Multer.File[]
	): Promise<Blog> {
		const headings: HeadingElement[] = [];
		const paragraphs: ParagraphElement[] = [];
		const imageElements: (ImageElement & { fileIndex?: number })[] = [];

		// Sort elements by position and categorize them
		blogData.elements.forEach((element) => {
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
		const title = headings.length > 0 ? headings[0].text : 'Untitled Blog';

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

		// Use the repository to create the blog with all its components
		return await blogRepository.createBlogWithTransaction(
			title,
			authorId,
			headings,
			paragraphs,
			imageReferences
		);
	},

	async deleteBlog(id: string): Promise<boolean> {
		const deleted = await blogRepository.deleteBlog(id);
		if (!deleted) {
			throw new Error('Blog not found or could not be deleted');
		}
		return true;
	},
};

// Helper function to extract title from blog data
function extractTitle(blogData: BlogData): string {
	// Find the first heading element to use as title
	const headingElement = blogData.elements.find((el) => el.type === 'heading');
	if (headingElement && 'text' in headingElement) {
		return headingElement.text;
	}
	return 'Untitled Blog';
}

export default blogServices;
