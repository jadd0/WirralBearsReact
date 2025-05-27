import { RequestHandler } from 'express';
import { imagesServices } from '../services/image.services';

export const getAllImages: RequestHandler = async (req, res) => {
	const { cursor } = req.params;

	if (!cursor) {
		res.status(400).send({ message: 'No cursor for pagination' });
		return;
	}

	try {
		const cursorNumber = parseInt(cursor);
		const result = await imagesServices.getAllImages(cursorNumber);

		if (result) {
			res.status(200).send({ ...result });
		}
	} catch (error) {
		console.error('Error fetching images:', error);
		res.status(500).send({
			message: 'Failed to upload image',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const deleteImage: RequestHandler = async (req, res) => {
	const { imageId } = req.params;

	if (!imageId) {
		res.status(400).send('No imageId');
	}

	try {
		const result = await imagesServices.deleteImage(imageId);

		if (result) {
			res.status(200).send();
		}
	} catch (error) {
		res.status(500).send('Error deleting image');
	}
};

export const imageControllers = {
	getAllImages,
	deleteImage,
} as {};
