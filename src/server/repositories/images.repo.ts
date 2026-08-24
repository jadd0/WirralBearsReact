import 'server-only';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import {
	images,
	firstCarousel,
	secondCarousel,
} from '@/db/schemas/images.schema';
import { IMAGE_LIMIT } from '@/lib/constants';
import { uploadthing } from '@/lib/uploadthing';

export type Image = typeof images.$inferSelect;
export type ImagePreview = Pick<Image, 'id' | 'url' | 'alt' | 'createdAt'>;

export type CarouselImage = {
	id: string;
	key: string;
	imageId: string;
	imageUrl: string | null;
};

export type CarouselImageInsert = {
	imageId: string;
	key: string;
};

export const imageRepository = {
	/**
	 * Creates a new image record in the database
	 */
	async createImage(imageData: {
		id?: string;
		key: string;
		authorId: string;
		url?: string;
		alt?: string;
	}): Promise<Image> {
		const [image] = await db.insert(images).values(imageData).returning();
		return image;
	},

	/**
	 * Gets a page of images, newest first. Fetches one row past the page size
	 * as a "peek" to determine whether another page exists, then trims it off
	 * before returning.
	 */
	async getAllImages(
		cursor: number
	): Promise<{ images: ImagePreview[]; hasMore: boolean }> {
		const result = await db
			.select({
				id: images.id,
				url: images.url,
				alt: images.alt,
				createdAt: images.createdAt,
			})
			.from(images)
			.limit(IMAGE_LIMIT + 1)
			.offset(cursor)
			.orderBy(desc(images.createdAt));

		const hasMore = result.length > IMAGE_LIMIT;
		return {
			images: hasMore ? result.slice(0, IMAGE_LIMIT) : result,
			hasMore,
		};
	},

	/**
	 * Deletes an image by ID, including its file in cloud storage
	 */
	async deleteImage(imageId: string): Promise<boolean> {
		const [image] = await db
			.select({ key: images.key })
			.from(images)
			.where(eq(images.id, imageId))
			.limit(1);

		if (!image) {
			throw new Error('No image found');
		}

		await db.delete(images).where(eq(images.id, imageId));
		await uploadthing.deleteFiles(image.key);

		return true;
	},

	/**
	 * Gets all images for the first home page carousel
	 */
	async getAllFirstCarouselImages(): Promise<CarouselImage[]> {
		return db
			.select({
				id: firstCarousel.id,
				key: firstCarousel.key,
				imageId: firstCarousel.imageId,
				imageUrl: images.url,
			})
			.from(firstCarousel)
			.innerJoin(images, eq(firstCarousel.imageId, images.id));
	},

	/**
	 * Gets all images for the B4A home page carousel
	 */
	async getAllB4ACarouselImages(): Promise<CarouselImage[]> {
		return db
			.select({
				id: secondCarousel.id,
				key: secondCarousel.key,
				imageId: secondCarousel.imageId,
				imageUrl: images.url,
			})
			.from(secondCarousel)
			.innerJoin(images, eq(secondCarousel.imageId, images.id));
	},

	/**
	 * Replaces all images for the first home page carousel in a single
	 * transaction (delete-then-insert, matching games.repo.ts's replace
	 * pattern)
	 */
	async replaceAllFirstCarouselImages(
		items: CarouselImageInsert[]
	): Promise<boolean> {
		return db.transaction(async (tx) => {
			await tx.delete(firstCarousel);
			if (items.length > 0) {
				await tx.insert(firstCarousel).values(items);
			}
			return true;
		});
	},

	/**
	 * Replaces all images for the B4A home page carousel in a single
	 * transaction
	 */
	async replaceAllB4ACarouselImages(
		items: CarouselImageInsert[]
	): Promise<boolean> {
		return db.transaction(async (tx) => {
			await tx.delete(secondCarousel);
			if (items.length > 0) {
				await tx.insert(secondCarousel).values(items);
			}
			return true;
		});
	},
};
