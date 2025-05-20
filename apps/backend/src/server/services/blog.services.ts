import { blogRepository } from '../repositories/blog.repo';
import { Blog } from '@/db/schemas/blog.schema';
import {
	BlogData,
	HeadingElement,
	ImageElement,
	ParagraphElement,
} from '@wirralbears/types';
import { uploadPostImages } from './images.services';
import { db } from '@/db';
import { images } from '@/db/schemas/images.schema';

export const blogServices = {
	async getAllBlogs(): Promise<Blog[]> {
		return blogRepository.findAll();
	},

	async getBlogById(id: string): Promise<Blog> {
		const blog = await blogRepository.getBlogById(id);

		if (!blog) {
			throw new Error('Blog not found');
		}
		return blog;
	},

	async uploadSingleImage(authorId: string, file: Express.Multer.File) {
		try {
			// Convert the Multer file to a Blob
			const fileBuffer = file.buffer;
			const fileName = file.originalname;
			const fileType = file.mimetype;

			// Create a Blob from the buffer
			const blobData = new Blob([fileBuffer], { type: fileType });

			// Create a File object from the Blob
			const fileObject = new File([blobData], fileName, { type: fileType });

			console.log('Processing file:', {
				name: fileObject.name,
				type: fileObject.type,
				size: fileObject.size,
			});

			// Upload the image
			const uploadResult = await uploadPostImages([fileObject]);

			if (uploadResult.failures > 0 || uploadResult.successes.length === 0) {
				console.error('Upload failed:', uploadResult);
				throw new Error('Failed to upload image');
			}

			// Get the uploaded image data
			const uploadedImage = uploadResult.successes[0];

			// Store the image record in the database
			const [image] = await db
				.insert(images)
				.values({
					key: uploadedImage.key,
					authorId: authorId,
				})
				.returning();

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

		// Process and upload images if there are any
		let imageReferences: { imageId: string; position: number; url: string }[] =
			[];

		if (files && files.length > 0) {
			// Convert Multer files to standard File objects
			const fileObjects = files.map((file) => {
				return new File([file.buffer], file.originalname, {
					type: file.mimetype,
				});
			});

			const uploadResult = await uploadPostImages(fileObjects);

			// Store image records and create references
			if (uploadResult.successes.length > 0) {
				// First insert the images into the images table
				const imageInserts = await db.transaction(async (tx) => {
					const insertedImages = [];

					for (const uploadedImage of uploadResult.successes) {
						const [image] = await tx
							.insert(images)
							.values({
								key: uploadedImage.key,
								authorId: authorId,
								url: uploadedImage.url,
							})
							.returning();

						// Find the corresponding image element by matching file name with original name
						const matchingElement = imageElements.find(
							(el) =>
								el.fileIndex !== undefined &&
								files[el.fileIndex]?.originalname === uploadedImage.name
						);

						const position = matchingElement?.position || 0;

						insertedImages.push({
							imageId: image.id,
							position: position,
							url: uploadedImage.url,
						});
					}

					return insertedImages;
				});

				imageReferences = imageInserts;
			}

			if (uploadResult.failures > 0) {
				console.warn(`Failed to upload ${uploadResult.failures} images`);
			}
		}

		// Extract title from the first heading or use default
		const title = headings.length > 0 ? headings[0].text : 'Untitled Blog';

		const result = await blogRepository.createBlog(title, authorId, {
			headings,
			paragraphs,
			images: imageReferences,
		});

		if (!result) {
			throw new Error('Failed to create blog');
		}

		return result as Blog;
	},

	async updateBlog(id: string, blogData: BlogData): Promise<Blog> {
		const blog = await blogRepository.getBlogById(id);

		if (!blog) {
			throw new Error('Blog not found');
		}

		const updatedBlog = await blogRepository.updateBlog(id, {
			title: extractTitle(blogData),
		});

		if (!updatedBlog) {
			throw new Error('Failed to update blog');
		}

		return updatedBlog;
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
