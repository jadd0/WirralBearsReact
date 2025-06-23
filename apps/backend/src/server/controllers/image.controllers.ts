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

	console.log(imageId)

	if (!imageId) {
		res.status(400).send('No imageId');
		return;
	}

	try {
		const result = await imagesServices.deleteImage(imageId);

		if (result) {
			res.status(200).send();
		}
	} catch (error) {
		res.status(500).send('Error deleting image');
		return;
	}
};

export const getAllFirstCarouselImages: RequestHandler = async (req, res) => {
	const result = await imagesServices.getAllFirstCarouselImages();
	
	if (!result) {
		res.status(500).send('Error retrieving images')
	}

	res.status(200).send(...result)
}

export const getAllB4ACarouselImages: RequestHandler = async (req, res) => {
	const result = await imagesServices.getAllB4ACarouselImages();
	
	if (!result) {
		res.status(500).send('Error retrieving images')
	}

	res.status(200).send(...result)
}

export const replaceAllFirstCarouselImages: RequestHandler = async (req, res) => {
	const images = req.body.images
	
	const result = await imagesServices.replaceAllFirstCarouselImages(images);
	
	if (!result) {
		res.status(500).send('Error replacing images')
	}

	res.status(200).send(...result)
}

export const replaceAllB4ACarouselImages: RequestHandler = async (req, res) => {
	const images = req.body.images
	
	const result = await imagesServices.replaceAllB4ACarouselImages(images);
	
	if (!result) {
		res.status(500).send('Error replacing images')
	}

	res.status(200).send(...result)
}

export const imageControllers = {
	getAllImages,
	deleteImage,
	getAllFirstCarouselImages,
	getAllB4ACarouselImages,
	replaceAllFirstCarouselImages,
	replaceAllB4ACarouselImages
} as {};
