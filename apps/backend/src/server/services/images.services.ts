import { imageCompression } from '@/lib/compression';
import { uploadthing } from '@/lib/uploadthing';
import { POST_IMAGE_CLOUD_ID_LENGTH } from '@wirralbears/constants';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { UploadedFileData, UploadFileResult } from 'uploadthing/types';

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
		console.log('Starting upload process for', images.length, 'images');

		const processedImageFiles = images.map((image) => {
			console.log('Processing image:', image.name, image.type, image.size);
			const imageFileExtension = image.name.split('.').at(-1);
			const imageFileName = `${nanoid(
				POST_IMAGE_CLOUD_ID_LENGTH
			)}.${imageFileExtension}`;
			return new File([image], imageFileName, { type: image.type });
		});

		console.log('Sending to uploadthing:', processedImageFiles.length, 'files');

		// This is where the error is likely happening
		const uploadResults = await uploadthing
			.uploadFiles(processedImageFiles)
			.catch((error) => {
				console.error('UploadThing error:', error);
				throw new Error(
					`UploadThing error: ${error.message || JSON.stringify(error)}`
				);
			});

		console.log('Upload results:', uploadResults);

		const successfulUploads = uploadResults
			.filter((result) => result.data && !result.error)
			.map(({ data }) => data);

		const unsuccessfulUploads = uploadResults
			.filter((result) => !result.data || result.error)
			.map(({ error }) => error);

		console.log('Upload summary:', {
			successes: successfulUploads.length,
			failures: unsuccessfulUploads.length,
			errors: unsuccessfulUploads,
		});

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
