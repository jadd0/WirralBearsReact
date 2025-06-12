import { blogServices } from '../services/blog.services';
import { BlogData } from '@wirralbears/types';
import { RequestHandler, Request, Response } from 'express';
import { blogRepository } from '../repositories/blog.repo';

export const updateBlog: RequestHandler = async (req, res) => {
	const { id } = req.params;
	const authorId = req.user?.id;

	if (!authorId) {
		res.status(401).send({ message: 'User not authenticated' });
		return;
	}

	try {
		// Parse the elements from the request body
		let elements = [];
		if (req.body.elements) {
			elements = JSON.parse(req.body.elements);
		}

		// Get the uploaded files
		const files = req.files as Express.Multer.File[];

		// Create the blog data object
		const blogData = { elements };

		console.log('Updating blog with elements:', blogData.elements);

		// Pass the blog data and files to the service
		const updatedBlog = await blogServices.updateBlog(
			id,
			authorId,
			blogData,
			files
		);

		if (updatedBlog) {
			res.status(200).send({
				blog: updatedBlog,
				id: updatedBlog.id,
				message: 'Blog updated successfully',
			});
		} else {
			res.status(404).send({ message: 'Blog not found' });
		}
	} catch (error) {
		console.error('Error updating blog:', error);
		res.status(500).send({
			message: 'Failed to update blog',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const getAllBlogs: RequestHandler = async (req, res) => {
	try {
		const blogs = await blogServices.getAllBlogs();
		res.status(200).send({ blogs });
	} catch (error) {
		console.error('Error fetching blogs:', error);
		res.status(500).send({ message: 'Failed to fetch blogs' });
	}
};

export const getBlogById: RequestHandler = async (req, res) => {
	const { id } = req.params;

	try {
		const blog = await blogServices.getBlogById(id);

		if (blog) res.status(200).send({ blog });
		else res.status(404).send({ message: 'Blog not found' });
	} catch (error) {
		console.error('Error fetching blog:', error);
		res.status(500).send({ message: 'Failed to fetch blog' });
	}
};

export const createBlog: RequestHandler = async (req, res) => {
	const authorId = req.user?.id;

	if (!authorId) {
		res.status(401).send({ message: 'User not authenticated' });
		return;
	}

	try {
		// Parse the elements from the request body
		let elements = [];
		if (req.body.elements) {
			elements = JSON.parse(req.body.elements);
		}

		// Get the uploaded files
		const files = req.files as Express.Multer.File[];

		// Create the blog data object
		const blogData = { elements };

		console.log(blogData.elements);

		// Pass the blog data and files to the service
		const newBlog = await blogServices.createBlog(authorId, blogData, files);

		res.status(201).send({
			blog: newBlog,
			id: newBlog.id,
			message: 'Blog created successfully',
		});
	} catch (error) {
		console.error('Error creating blog:', error);
		res.status(500).send({
			message: 'Failed to create blog',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const uploadImage: RequestHandler = async (req, res) => {
	const authorId = req.user?.id;

	if (!authorId) {
		res.status(401).send({ message: 'User not authenticated' });
		return;
	}

	try {
		// Check if there's a file in the request
		if (!req.file) {
			res.status(400).send({ message: 'No image file provided' });
			return;
		}

		// Upload the image
		const result = await blogServices.uploadSingleImage(authorId, req.file);

		res.status(200).send({
			url: result.url,
			message: 'Image uploaded successfully',
		});
	} catch (error) {
		console.error('Error uploading image:', error);
		res.status(500).send({
			message: 'Failed to upload image',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const getAllBlogPreviews: RequestHandler = async (req, res) => {
	const result = await blogServices.getAllBlogs();

	res.status(200).send({ blogs: result });
};

// export const updateBlog: RequestHandler = async (req, res) => {
// 	const { id } = req.params;
// 	const authorId = req.user?.id;

// 	if (!authorId) {
// 		res.status(401).send({ message: 'User not authenticated' });
// 		return;
// 	}

// 	const blogData: BlogData = req.body;

// 	if (!blogData || !blogData.elements) {
// 		res.status(400).send({ message: 'Invalid blog data' });
// 		return;
// 	}

// 	try {
// 		const updatedBlog = await blogServices.updateBlog(id, blogData);

// 		if (updatedBlog) res.status(200).send({ blog: updatedBlog });
// 		else res.status(404).send({ message: 'Blog not found' });
// 	} catch (error) {
// 		console.error('Error updating blog:', error);
// 		res.status(500).send({ message: 'Failed to update blog' });
// 	}
// };

export const deleteBlog: RequestHandler = async (req, res) => {
	const { id } = req.params;
	const authorId = req.user?.id;

	if (!authorId) {
		res.status(401).send({ message: 'User not authenticated' });
		return;
	}

	try {
		const result = await blogServices.deleteBlog(id);

		if (result) res.status(200).send({ message: 'Blog deleted successfully' });
		else res.status(404).send({ message: 'Blog not found' });
	} catch (error) {
		console.error('Error deleting blog:', error);
		res.status(500).send({ message: 'Failed to delete blog' });
	}
};

export const uploadMultipleImages: RequestHandler = async (req, res) => {
	const authorId = req.user?.id;

	if (!authorId) {
		res.status(401).send({ message: 'User not authenticated' });
		return;
	}

	try {
		// Check if there are files in the request
		const files = req.files as Express.Multer.File[];
		if (!files || files.length === 0) {
			res.status(400).send({ message: 'No image files provided' });
			return;
		}

		// Parse alt texts if provided (optional)
		let altTexts: string[] | undefined;
		if (req.body.altTexts) {
			try {
				altTexts = JSON.parse(req.body.altTexts);
			} catch (parseError) {
				res
					.status(400)
					.send({ message: 'Invalid altTexts format. Must be a JSON array.' });
				return;
			}
		}

		// Upload the images using the blog service
		const result = await blogServices.uploadMultipleImages(files, authorId, altTexts);

		// Check if there were any failures
		if (result.failures.length > 0) {
			res.status(207).send({
				message: 'Some images uploaded successfully, but some failed',
				successes: result.successes,
				failures: result.failures,
				totalUploaded: result.totalUploaded,
				totalProcessed: result.totalProcessed,
			});
			return;
		}

		res.status(200).send({
			message: 'All images uploaded successfully',
			images: result.successes,
			totalUploaded: result.totalUploaded,
		});
	} catch (error) {
		console.error('Error uploading multiple images:', error);
		res.status(500).send({
			message: 'Failed to upload images',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export default {
	getAllBlogs,
	getBlogById,
	createBlog,
	updateBlog,
	deleteBlog,
	uploadImage,
	getAllBlogPreviews,
	uploadMultipleImages,
} as {};
