import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { images, blogImages, coachImages } from '@/db/schemas/images.schema';
import { IMAGE_LIMIT } from '@wirralbears/constants';
import { Image } from '@/types/image.types';

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
	}) {
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
	}) {
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
	) {
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
	) {
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
	async getBlogImages(blogId: string) {
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
	async getCoachImages(coachId: string) {
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
	) {
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
	) {
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
	) {
		await tx.insert(coachImages).values(relationData).returning();
	},

	async getAllImages(cursor: number): Image {
		const result = db
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

	async deleteImage(imageId: string) {
		const result = db.delete(images).where(eq(images.id, imageId));

		return result;
	},
};
