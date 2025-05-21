import { blogRepository } from '../repositories/blog.repo';
import { imageRepository } from '../repositories/images.repo';
import { Blog } from '@/db/schemas/blog.schema';
import {
	BlogData,
	HeadingElement,
	ImageElement,
	ParagraphElement,
} from '@wirralbears/types';
import { uploadPostImages } from './images.services';

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

			// Upload the image
			const uploadResult = await uploadPostImages([fileObject]);

			if (uploadResult.failures > 0 || uploadResult.successes.length === 0) {
				console.error('Upload failed:', uploadResult);
				throw new Error('Failed to upload image');
			}

			// Get the uploaded image data
			const uploadedImage = uploadResult.successes[0];

			if (!uploadedImage) {
				return false;
			}

			// Store the image record in the database using the repository
			const image = await imageRepository.createImage({
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

		// Process blog data to extract elements
		// (This part would need to be implemented based on how you're parsing blogData)

		// Extract title from the first heading or use default
		const title = headings.length > 0 ? headings[0].text : 'Untitled Blog';

		// Process and upload images if there are any
		let imageReferences: { imageId: string; position: number }[] = [];

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
				for (let i = 0; i < uploadResult.successes.length; i++) {
					const uploadedImage = uploadResult.successes[i];
					const matchingElement = imageElements.find(
						(el) => el.fileIndex === i
					);
					const position = matchingElement?.position || i;

					// Create image record
					const image = await imageRepository.createImage({
						key: uploadedImage.key,
						authorId: authorId,
						url: uploadedImage.url,
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
