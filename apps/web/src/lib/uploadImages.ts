import 'server-only';
import { nanoid } from 'nanoid';
import { POST_IMAGE_CLOUD_ID_LENGTH } from '@/lib/constants';
import { uploadthing } from '@/lib/uploadthing';

/**
 * Generic multi-file upload helper backed by UploadThing.
 *
 * Renames each file to a random id (preserving its extension) before
 * uploading, then splits the results into successes/failures. Shared by
 * every domain that lets an admin attach images (coaches, blog, images).
 *
 * @param files image files to upload to the cloud
 */
export const uploadImages = async (files: File[]) => {
	try {
		const processedFiles = files.map((file) => {
			const fileExtension = file.name.split('.').at(-1);
			const fileName = `${nanoid(POST_IMAGE_CLOUD_ID_LENGTH)}.${fileExtension}`;
			return new File([file], fileName, { type: file.type });
		});

		const uploadResults = await uploadthing
			.uploadFiles(processedFiles)
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
			throw new Error(`Upload failed: ${JSON.stringify(unsuccessfulUploads[0])}`);
		}

		return {
			successes: successfulUploads,
			failures: unsuccessfulUploads.length,
		};
	} catch (error) {
		console.error('Error in uploadImages:', error);
		throw error;
	}
};
