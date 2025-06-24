import { eq } from 'drizzle-orm';
import { db } from '@/db';
import {
	images,
	blogImages,
	coachImages,
	firstCarousel,
	secondCarousel,
} from '@/db/schemas/images.schema';
import { IMAGE_LIMIT } from '@wirralbears/constants';
import { Image } from '@/types/image.types';
import { UTApi } from 'uploadthing/server';

export const imageRepository: any = {
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
	 * Creates a relationship between a blog and an image
	 */
	async createBlogImageRelation(relationData: {
		blogId: string;
		imageId: string;
		position: number;
	}): Promise<any> {
		const [relation] = await db
			.insert(blogImages)
			.values(relationData)
			.returning();
		return relation;
	},

	/**
	 * Creates a relationship between a coach and an image
	 */
	async createCoachImageRelation(relationData: {
		coachId: string;
		imageId: string;
		position: number;
	}) {
		const [relation] = await db
			.insert(coachImages)
			.values(relationData)
			.returning();
		return relation;
	},

	/**
	 * Batch creates multiple blog-image relations
	 */
	async createBlogImageRelations(
		relations: {
			blogId: string;
			imageId: string;
			position: number;
		}[]
	): Promise<any> {
		if (relations.length === 0) return [];
		const insertedRelations = await db
			.insert(blogImages)
			.values(relations)
			.returning();
		return insertedRelations;
	},

	/**
	 * Batch creates multiple coach-image relations
	 */
	async createCoachImageRelations(
		relations: {
			coachId: string;
			imageId: string;
			position: number;
		}[]
	): Promise<any> {
		if (relations.length === 0) return [];
		const insertedRelations = await db
			.insert(coachImages)
			.values(relations)
			.returning();
		return insertedRelations;
	},

	/**
	 * Gets all images for a specific blog
	 */
	async getBlogImages(blogId: string): Promise<any> {
		const blogImageRelations = await db
			.select({
				image: images,
				position: blogImages.position,
			})
			.from(blogImages)
			.innerJoin(images, eq(blogImages.imageId, images.id))
			.where(eq(blogImages.blogId, blogId))
			.orderBy(blogImages.position);

		return blogImageRelations;
	},

	/**
	 * Gets all images for a specific coach
	 */
	async getCoachImages(coachId: string): Promise<any> {
		const coachImageRelations = await db
			.select({
				image: images,
				position: coachImages.position,
			})
			.from(coachImages)
			.innerJoin(images, eq(coachImages.imageId, images.id))
			.where(eq(coachImages.coachId, coachId))
			.orderBy(coachImages.position);

		return coachImageRelations;
	},

	/**
	 * Creates an image record within a transaction
	 */
	async createImageWithTransaction(
		tx: any,
		imageData: {
			id?: string;
			key: string;
			authorId: string;
			url?: string;
		}
	): Promise<Image> {
		const [image] = await tx.insert(images).values(imageData).returning();
		return image;
	},

	/**
	 * Creates a blog-image relation within a transaction
	 */
	async createBlogImageRelationWithTransaction(
		tx: any,
		relationData: {
			blogId: string;
			imageId: string;
			position: number;
		}
	): Promise<any> {
		await tx.insert(blogImages).values(relationData).returning();
	},

	/**
	 * Creates a coach-image relation within a transaction
	 */
	async createCoachImageRelationWithTransaction(
		tx: any,
		relationData: {
			coachId: string;
			imageId: string;
			position: number;
		}
	): Promise<any> {
		await tx.insert(coachImages).values(relationData).returning();
	},

	/**
	 * Gets all images with pagination
	 */
	async getAllImages(cursor: number): Promise<Image[]> {
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
			.orderBy(images.createdAt);

		return result;
	},

	/**
	 * Deletes an image by ID
	 */
	async deleteImage(imageId: string): Promise<any> {
		const image = await db.select({ key: images.key }).from(images);

		if (!image) {
			throw new Error('No image found');
		}

		const result = await db.delete(images).where(eq(images.id, imageId));

		if (!result) {
			throw new Error('Error occured whilst trying to delete image');
		}

		const utapi = new UTApi();
		await utapi.deleteFiles(image[0].key);

		return true;
	},

	/**
	 * Gets all images for the first home page carousel
	 */
	async getAllFirstCarouselImages(): Promise<any> {
		const result = await db
			.select({
				id: firstCarousel.id,
				key: firstCarousel.key,
				imageId: firstCarousel.imageId,
				imageUrl: images.url,
			})
			.from(firstCarousel)
			.innerJoin(images, eq(firstCarousel.imageId, images.id));
		return result;
	},

	/**
	 * Gets all images for the b4a home page carousel
	 */
	async getAllB4ACarouselImages(): Promise<any> {
		const result = await db
			.select({
				id: secondCarousel.id,
				key: secondCarousel.key,
				imageId: secondCarousel.imageId,
				imageUrl: images.url,
			})
			.from(secondCarousel)
			.innerJoin(images, eq(secondCarousel.imageId, images.id));
		return result;
	},

	/**
	 * Replaces all images for the first home page carousel
	 */
	async replaceAllFirstCarouselImages(
		images: {
			imageId: string;
			key: string;
		}[]
	): Promise<any> {
		const firstRes = await db.delete(firstCarousel);

		if (!firstRes) {
			throw new Error('Unable to delete all images from the first carousel');
		}

		const result = await db.insert(firstCarousel).values(images);
		return result;
	},

	/**
	 * Replaces all images for the B4A home page carousel
	 */
	async replaceAllB4ACarouselImages(
		images: {
			imageId: string;
			key: string;
		}[]
	): Promise<any> {
		const firstRes = await db.delete(secondCarousel);

		if (!firstRes) {
			throw new Error('Unable to delete all images from the b4a carousel');
		}

		const result = await db.insert(secondCarousel).values(images);
		return result;
	},
} as const;
