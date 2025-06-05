import { coachServices } from '../services/coach.services';
import { BlogData } from '@wirralbears/types';
import { RequestHandler, Request, Response } from 'express';
import { coachRepository } from '../repositories/coach.repo';

export const updateCoach: RequestHandler = async (req, res) => {
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

		// Create the coach data object
		const blogData = { elements };

		console.log('Updating coach with elements:', blogData.elements);

		// Pass the coach data and files to the service
		const updatedBlog = await coachServices.updateCoach(
			id,
			authorId,
			blogData,
			files
		);

		if (updatedBlog) {
			res.status(200).send({
				coach: updatedBlog,
				id: updatedBlog.id,
				message: 'Coach updated successfully',
			});
		} else {
			res.status(404).send({ message: 'Coach not found' });
		}
	} catch (error) {
		console.error('Error updating coach:', error);
		res.status(500).send({
			message: 'Failed to update coach',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const getAllCoaches: RequestHandler = async (req, res) => {
	try {
		const coaches = await coachServices.getAllCoaches();
		res.status(200).send({ coaches });
	} catch (error) {
		console.error('Error fetching coaches:', error);
		res.status(500).send({ message: 'Failed to fetch coaches' });
	}
};

export const getCoachById: RequestHandler = async (req, res) => {
	const { id } = req.params;

	try {
		const coach = await coachServices.getCoachById(id);

		if (coach) res.status(200).send({ coach });
		else res.status(404).send({ message: 'Coach not found' });
	} catch (error) {
		console.error('Error fetching coach:', error);
		res.status(500).send({ message: 'Failed to fetch coach' });
	}
};

export const createCoach: RequestHandler = async (req, res) => {
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

		// Create the coach data object
		const blogData = { elements };

		console.log(blogData.elements);

		// Pass the coach data and files to the service
		const newBlog = await coachServices.createCoach(authorId, blogData, files);

		res.status(201).send({
			coach: newBlog,
			id: newBlog.id,
			message: 'Coach created successfully',
		});
	} catch (error) {
		console.error('Error creating coach:', error);
		res.status(500).send({
			message: 'Failed to create coach',
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
		const result = await coachServices.uploadSingleImage(authorId, req.file);

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

export const getAllCoachPreviews: RequestHandler = async (req, res) => {
	const result = await coachServices.getAllCoaches();

	res.status(200).send({ coaches: result });
};

// export const updateCoach: RequestHandler = async (req, res) => {
// 	const { id } = req.params;
// 	const authorId = req.user?.id;

// 	if (!authorId) {
// 		res.status(401).send({ message: 'User not authenticated' });
// 		return;
// 	}

// 	const blogData: BlogData = req.body;

// 	if (!blogData || !blogData.elements) {
// 		res.status(400).send({ message: 'Invalid coach data' });
// 		return;
// 	}

// 	try {
// 		const updatedBlog = await coachServices.updateCoach(id, blogData);

// 		if (updatedBlog) res.status(200).send({ coach: updatedBlog });
// 		else res.status(404).send({ message: 'Coach not found' });
// 	} catch (error) {
// 		console.error('Error updating coach:', error);
// 		res.status(500).send({ message: 'Failed to update coach' });
// 	}
// };

export const deleteCoach: RequestHandler = async (req, res) => {
	const { id } = req.params;
	const authorId = req.user?.id;

	if (!authorId) {
		res.status(401).send({ message: 'User not authenticated' });
		return;
	}

	try {
		const result = await coachServices.deleteCoach(id);

		if (result) res.status(200).send({ message: 'Coach deleted successfully' });
		else res.status(404).send({ message: 'Coach not found' });
	} catch (error) {
		console.error('Error deleting coach:', error);
		res.status(500).send({ message: 'Failed to delete coach' });
	}
};

export default {
	getAllCoaches,
	getCoachById,
	createCoach,
	updateCoach,
	deleteCoach,
	uploadImage,
	getAllCoachPreviews,
} as {};
