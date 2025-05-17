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

	async createBlog(authorId: string, blogData: BlogData): Promise<Blog> {
		const headings: HeadingElement[] = [];
		const paragraphs: ParagraphElement[] = [];
		const imageElements: ImageElement[] = [];
		const imageFiles: File[] = [];

		console.log({blogData})

		// Sort elements by position and categorize them
		blogData.forEach((element) => {
			switch (element.type) {
				case 'heading':
					headings.push(element as HeadingElement);
					break;
				case 'paragraph':
					paragraphs.push(element as ParagraphElement);
					break;
				case 'image':
					const imageElement = element as ImageElement;
					imageElements.push(imageElement);

					// If there's an actual File object in the data, add it to files to upload
					if ('file' in imageElement && imageElement.file instanceof File) {
						imageFiles.push(imageElement.file);
					}
					break;
			}
		});

		// Process and upload images first if there are any
		let imageReferences: { imageId: string; position: number }[] = [];

		if (imageFiles.length > 0) {
			const uploadResult = await uploadPostImages(imageFiles);

			// Store image records and create references
			if (uploadResult.successes.length > 0) {
				// First insert the images into the images table
				const imageInserts = await db.transaction(async (tx) => {
					const insertedImages = [];

					for (const [
						index,
						uploadedImage,
					] of uploadResult.successes.entries()) {
						const [image] = await tx
							.insert(images)
							.values({
								key: uploadedImage.key,
								authorId: authorId,
							})
							.returning();

						insertedImages.push({
							imageId: image.id,
							position: imageElements[index].position,
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
