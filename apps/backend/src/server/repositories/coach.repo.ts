import { eq, sql, and } from 'drizzle-orm';
import { db } from '@/db';
import {
	Coaches,
	NewCoach,
	coachHeadings,
	coachParagraphs,
	coaches,
} from '@/db/schemas/coach.schema';
import { coachImages, images } from '@/db/schemas/images.schema';
import {
	HeadingElement,
	ParagraphElement,
} from '@wirralbears/types';
import { CoachPreview } from '@/types/coach.types';
import { users } from '@/db/schema';

export const coachRepository = {
	async findAll() {
		const lowestPositionImages = db
			.select({
				coachId: coachImages.coachId,
				minPosition: sql`MIN(${coachImages.position})`.as('minPosition'),
			})
			.from(coachImages)
			.groupBy(coachImages.coachId)
			.as('lowestPositionImages');

		return db
			.select({
				id: coaches.id,
				title: coaches.title,
				username: users.username,
				createdAt: coaches.createdAt,
				updatedAt: coaches.updatedAt,
				image: {
					id: images.id,
					key: images.key,
					url: images.url,
					authorId: images.authorId,
					alt: images.alt,
				},
			})
			.from(coaches)
			.leftJoin(lowestPositionImages, eq(coaches.id, lowestPositionImages.coachId))
			.leftJoin(
				coachImages,
				and(
					eq(coaches.id, coachImages.coachId),
					eq(coachImages.position, lowestPositionImages.minPosition)
				)
			)
			.leftJoin(images, eq(coachImages.imageId, images.id))
			.leftJoin(users, eq(coaches.authorId, users.id))
			.orderBy(coaches.createdAt);
	},

	async updateCoachWithTransaction(
		coachId: string,
		title: string,
		headings: HeadingElement[],
		paragraphs: ParagraphElement[],
		imageReferences: { imageId: string; position: number }[]
	): Promise<Coaches> {
		return await db.transaction(async (tx) => {
			// Update main coach
			const [coach] = await tx
				.update(coaches)
				.set({
					title,
					updatedAt: new Date(),
				})
				.where(eq(coaches.id, coachId))
				.returning();

			// Delete existing headings, paragraphs, and image relations
			await Promise.all([
				tx.delete(coachHeadings).where(eq(coachHeadings.coachId, coachId)),
				tx.delete(coachParagraphs).where(eq(coachParagraphs.coachId, coachId)),
				tx.delete(coachImages).where(eq(coachImages.coachId, coachId)),
			]);

			// Insert new headings
			if (headings.length > 0) {
				await tx.insert(coachHeadings).values(
					headings.map((heading) => ({
						text: heading.text,
						coachId: coach.id,
						position: heading.position ?? 0,
					}))
				);
			}

			// Insert new paragraphs
			if (paragraphs.length > 0) {
				await tx.insert(coachParagraphs).values(
					paragraphs.map((paragraph) => ({
						text: paragraph.text,
						coachId: coach.id,
						position: paragraph.position ?? 0,
					}))
				);
			}

			// Insert new coach-image relationships
			if (imageReferences.length > 0) {
				await tx.insert(coachImages).values(
					imageReferences.map((ref) => ({
						coachId: coach.id,
						imageId: ref.imageId,
						position: ref.position,
					}))
				);
			}

			return coach;
		});
	},

	async getCoachById(coachId: string) {
		// Get the main coach and author
		const coachResult = await db
			.select({
				coach: {
					id: coaches.id,
					title: coaches.title,
					authorId: coaches.authorId,
					createdAt: coaches.createdAt,
					updatedAt: coaches.updatedAt,
				},
				author: {
					id: users.id,
					username: users.username,
				},
			})
			.from(coaches)
			.leftJoin(users, eq(coaches.authorId, users.id))
			.where(eq(coaches.id, coachId));

		if (coachResult.length === 0) {
			return null;
		}

		const { coach, author } = coachResult[0];

		// Get headings, paragraphs, and images separately
		const [headings, paragraphs, coachImagesWithDetails] = await Promise.all([
			// Get headings
			db
				.select()
				.from(coachHeadings)
				.where(eq(coachHeadings.coachId, coachId))
				.orderBy(coachHeadings.position),

			// Get paragraphs
			db
				.select()
				.from(coachParagraphs)
				.where(eq(coachParagraphs.coachId, coachId))
				.orderBy(coachParagraphs.position),

			// Get images with their coach relationship
			db
				.select({
					id: images.id,
					key: images.key,
					url: images.url,
					alt: images.alt,
					position: coachImages.position,
				})
				.from(coachImages)
				.leftJoin(images, eq(coachImages.imageId, images.id))
				.where(eq(coachImages.coachId, coachId))
				.orderBy(coachImages.position),
		]);

		return {
			...coach,
			author,
			headings: headings || [],
			paragraphs: paragraphs || [],
			images: coachImagesWithDetails || [],
		};
	},

	async createCoachWithTransaction(
		title: string,
		authorId: string,
		headings: HeadingElement[],
		paragraphs: ParagraphElement[],
		imageReferences: { imageId: string; position: number }[]
	): Promise<Coaches> {
		return await db.transaction(async (tx) => {
			// Insert main coach
			const [coach] = await tx
				.insert(coaches)
				.values({
					title,
					authorId,
				})
				.returning();

			// Insert headings
			if (headings.length > 0) {
				await tx.insert(coachHeadings).values(
					headings.map((heading) => ({
						text: heading.text,
						coachId: coach.id,
						position: heading.position ?? 0,
					}))
				);
			}

			// Insert paragraphs
			if (paragraphs.length > 0) {
				await tx.insert(coachParagraphs).values(
					paragraphs.map((paragraph) => ({
						text: paragraph.text,
						coachId: coach.id,
						position: paragraph.position ?? 0,
					}))
				);
			}

			// Insert coach-image relationships
			if (imageReferences.length > 0) {
				await tx.insert(coachImages).values(
					imageReferences.map((ref) => ({
						coachId: coach.id,
						imageId: ref.imageId,
						position: ref.position,
					}))
				);
			}

			return coach;
		});
	},

	async updateCoach(
		id: string,
		coach: Partial<NewCoach>
	): Promise<Coaches | undefined> {
		const result = await db
			.update(coaches)
			.set({ ...coach, updatedAt: new Date() })
			.where(eq(coaches.id, id))
			.returning();
		return result[0];
	},

	async deleteCoach(id: string): Promise<boolean> {
		const result = await db.delete(coaches).where(eq(coaches.id, id)).returning();
		return result.length > 0;
	},
};
