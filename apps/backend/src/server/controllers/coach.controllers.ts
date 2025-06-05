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
		const coachData = { elements };

		console.log('Updating coach with elements:', coachData.elements);

		// Pass the coach data and files to the service
		const updatedCoach = await coachServices.updateCoach(
			id,
			authorId,
			coachData,
			files
		);

		if (updatedCoach) {
			res.status(200).send({
				coach: updatedCoach,
				id: updatedCoach.id,
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
		const coachData = { elements };

		console.log(coachData.elements);

		// Pass the coach data and files to the service
		const newCoach = await coachServices.createCoach(authorId, coachData, files);

		res.status(201).send({
			coach: newCoach,
			id: newCoach.id,
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

// 	const coachData: BlogData = req.body;

// 	if (!coachData || !coachData.elements) {
// 		res.status(400).send({ message: 'Invalid coach data' });
// 		return;
// 	}

// 	try {
// 		const updatedCoach = await coachServices.updateCoach(id, coachData);

// 		if (updatedCoach) res.status(200).send({ coach: updatedCoach });
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
