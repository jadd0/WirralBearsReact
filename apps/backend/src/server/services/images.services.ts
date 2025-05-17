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
	// TODO: add better error fallbacks and logging

	const processedImageFiles = images.map((image) => {
		const imageFileExtension = image.name.split('.').at(-1);
		const imageFileName = `${nanoid(
			POST_IMAGE_CLOUD_ID_LENGTH
		)}.${imageFileExtension}`;

		return new File([image], imageFileName, { type: image.type });
	});

	const uploadResults = await uploadthing.uploadFiles(processedImageFiles);

	const isSuccessfulUpload = ({ data, error }: UploadFileResult) =>
		data && !error;

	const successfulUploads = uploadResults
		.filter(isSuccessfulUpload)
		.map(({ data }) => data as UploadedFileData);

	// TODO: handle unsuccessful uploads
	const unsuccessfulUploads = uploadResults
		.filter((result) => !isSuccessfulUpload(result))
		.map(({ error }) => error);

	return {
		successes: successfulUploads,
		failures: unsuccessfulUploads.length,
	};
};
