import { blogServices } from '../services/blog.services';
import { BlogData } from '@wirralbears/types';
import { RequestHandler, Request, Response } from 'express';
import { blogRepository } from '../repositories/blog.repo';

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
	const result = await blogRepository.findAll();

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

export default {
	getAllBlogs,
	getBlogById,
	createBlog,
	// updateBlog,
	deleteBlog,
	uploadImage,
	getAllBlogPreviews,
} as {};
