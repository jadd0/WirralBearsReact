import 'server-only';
import { IMAGE_LIMIT } from '@/lib/constants';
import {
	imageRepository,
	type CarouselImage,
	type CarouselImageInsert,
	type ImagePreview,
} from '@/server/repositories/images.repo';

export const imageServices = {
	/**
	 * Get a cursor-paginated page of images, newest first
	 */
	async getAllImages(
		cursor: number
	): Promise<{ images: ImagePreview[]; nextCursor: number | null }> {
		const { images, hasMore } = await imageRepository.getAllImages(cursor);
		return {
			images,
			nextCursor: hasMore ? cursor + IMAGE_LIMIT : null,
		};
	},

	/**
	 * Delete an image and its file in cloud storage
	 */
	async deleteImage(imageId: string): Promise<boolean> {
		return imageRepository.deleteImage(imageId);
	},

	/**
	 * Get all images for the first home page carousel
	 */
	async getAllFirstCarouselImages(): Promise<CarouselImage[]> {
		return imageRepository.getAllFirstCarouselImages();
	},

	/**
	 * Get all images for the B4A home page carousel
	 */
	async getAllB4ACarouselImages(): Promise<CarouselImage[]> {
		return imageRepository.getAllB4ACarouselImages();
	},

	/**
	 * Replace all images for the first home page carousel
	 */
	async replaceAllFirstCarouselImages(
		items: CarouselImageInsert[]
	): Promise<boolean> {
		return imageRepository.replaceAllFirstCarouselImages(items);
	},

	/**
	 * Replace all images for the B4A home page carousel
	 */
	async replaceAllB4ACarouselImages(
		items: CarouselImageInsert[]
	): Promise<boolean> {
		return imageRepository.replaceAllB4ACarouselImages(items);
	},
};
