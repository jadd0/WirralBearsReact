import 'server-only';
import { blogRepository } from '@/server/repositories/blog.repo';
import { imageRepository } from '@/server/repositories/images.repo';
import { Blog } from '@/db/schemas/blog.schema';
import {
	BlogData,
	HeadingElement,
	ImageElement,
	ParagraphElement,
} from '@/lib/types';
import { uploadImages } from '@/lib/uploadImages';

export const blogServices = {
	async getAllBlogs() {
		return blogRepository.findAll();
	},

	async updateBlog(
		blogId: string,
		authorId: string,
		blogData: BlogData,
		files?: File[]
	): Promise<Blog | null> {
		// First, verify the blog exists
		const existingBlog = await blogRepository.getBlogById(blogId);

		if (!existingBlog) {
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
			const uploadResult = await uploadImages(files);

			if (uploadResult.successes.length > 0) {
				for (let i = 0; i < uploadResult.successes.length; i++) {
					const uploadedImage = uploadResult.successes[i];

					if (!uploadedImage) {
						throw new Error('Upload succeeded but no image data was returned');
					}

					// Find the matching element by fileIndex
					const matchingElement = imageElements.find((el) => el.fileIndex === i);

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
	 * Upload multiple images independently (not associated with any blog).
	 *
	 * Cloud upload failures throw (uploadImages itself throws on any
	 * failure); per-image database insert failures are collected and
	 * returned so the caller can report a partial success.
	 */
	async uploadMultipleImages(
		files: File[],
		authorId: string,
		altTexts?: string[]
	) {
		if (!files || files.length === 0) {
			throw new Error('No files provided for upload');
		}

		if (altTexts && altTexts.length !== files.length) {
			throw new Error('Alt texts array length must match files array length');
		}

		const uploadResult = await uploadImages(files);

		if (uploadResult.successes.length === 0) {
			throw new Error('Failed to upload images');
		}

		const databaseImages: Array<{
			id: string;
			url: string | undefined;
			key: string;
			alt: string;
			originalName: string;
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

				const image = await imageRepository.createImage({
					key: uploadedImage.key,
					url: uploadedImage.url,
					alt,
					authorId,
				});

				databaseImages.push({
					id: image.id,
					url: uploadedImage.url,
					key: uploadedImage.key,
					alt,
					originalName: files[i].name,
					index: i,
				});
			} catch (dbError) {
				console.error(`Failed to create database record for image ${i}:`, dbError);
				failedDatabaseInserts.push({
					index: i,
					error:
						dbError instanceof Error ? dbError.message : 'Unknown database error',
				});
			}
		}

		return {
			successes: databaseImages,
			failures: failedDatabaseInserts,
			totalUploaded: uploadResult.successes.length,
			totalProcessed: files.length,
		};
	},

	async getBlogById(id: string) {
		const blog = await blogRepository.getBlogById(id);

		if (!blog) {
			throw new Error('Blog not found');
		}
		return blog;
	},

	async uploadSingleImage(authorId: string, file: File) {
		try {
			// Generate a clean filename to use as ID (remove extension and special chars)
			const fileId = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');

			// Upload the image
			const uploadResult = await uploadImages([file]);

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
		files?: File[]
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
			const uploadResult = await uploadImages(files);

			if (uploadResult.successes.length > 0) {
				for (let i = 0; i < uploadResult.successes.length; i++) {
					const uploadedImage = uploadResult.successes[i];

					if (!uploadedImage) {
						throw new Error('Upload succeeded but no image data was returned');
					}

					// Find the matching element by fileIndex
					const matchingElement = imageElements.find((el) => el.fileIndex === i);

					const position = matchingElement?.position || i;
					const alt = matchingElement?.alt || `Image ${i + 1}`; // Provide fallback

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

export default blogServices;
