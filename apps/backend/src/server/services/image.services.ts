import { imageCompression } from '@/lib/compression';
import { uploadthing } from '@/lib/uploadthing';
import {
	IMAGE_LIMIT,
	POST_IMAGE_CLOUD_ID_LENGTH,
} from '@wirralbears/constants';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { UploadedFileData, UploadFileResult } from 'uploadthing/types';
import { imageRepository } from '../repositories/images.repo';

/**
 * The inferred result of a file upload using Uploadthing.
 * Typescript has issues inferring the correct type for the upload result.
 * This type is used to ensure that the result is correctly typed.
 */
type InferredUploadFileResult = Awaited<
	ReturnType<typeof uploadthing.uploadFiles>
>[number];

/**
 * upload post images to the cloud
 *
 * @param images image files to upload to the cloud
 * @returns
 */
export const uploadPostImages = async (images: File[]) => {
	try {
		const processedImageFiles = images.map((image) => {
			const imageFileExtension = image.name.split('.').at(-1);
			const imageFileName = `${nanoid(
				POST_IMAGE_CLOUD_ID_LENGTH
			)}.${imageFileExtension}`;
			return new File([image], imageFileName, { type: image.type });
		});

		const uploadResults = await uploadthing
			.uploadFiles(processedImageFiles)
			.catch((error) => {
				console.error('UploadThing error:', error);
				throw new Error(
					`UploadThing error: ${error.message || JSON.stringify(error)}`
				);
			});

		const successfulUploads = uploadResults
			.filter((result) => result.data && !result.error)
			.map(({ data }) => data);

		const unsuccessfulUploads = uploadResults
			.filter((result) => !result.data || result.error)
			.map(({ error }) => error);

		if (unsuccessfulUploads.length > 0) {
			throw new Error(
				`Upload failed: ${JSON.stringify(unsuccessfulUploads[0])}`
			);
		}

		return {
			successes: successfulUploads,
			failures: unsuccessfulUploads.length,
		};
	} catch (error) {
		console.error('Error in uploadPostImages:', error);
		throw error;
	}
};

export const getAllImages = async (cursor: number) => {
	const result = await imageRepository.getAllImages(cursor);

	return {
		images: result,
		nextCursor: result.length < IMAGE_LIMIT ? null : cursor + IMAGE_LIMIT,
	};
};

export const deleteImage = async (imageId: string) => {
	const result = await imageRepository.deleteImage(imageId);
	return result;
};

export const getAllFirstCarouselImages = async () => {
	const result = await imageRepository.getAllFirstCarouselImages();
	return result;
};

export const getAllB4ACarouselImages = async () => {
	const result = await imageRepository.getAllB4ACarouselImages();
	return result;
};

export const replaceAllFirstCarouselImages = async (
	images: {
		imageId: string;
		key: string;
	}[]
) => {
	const result = await imageRepository.replaceAllFirstCarouselImages(images);
	return result;
};

export const replaceAllB4ACarouselImages = async (
	images: {
		imageId: string;
		key: string;
	}[]
) => {
	const result = await imageRepository.replaceAllB4ACarouselImages(images);
	return result;
};

export const imagesServices = {
	uploadPostImages,
	getAllImages,
	deleteImage,
	getAllFirstCarouselImages,
	getAllB4ACarouselImages,
	replaceAllFirstCarouselImages,
	replaceAllB4ACarouselImages
};
