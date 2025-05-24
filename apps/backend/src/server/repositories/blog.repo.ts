import { eq, sql, and } from 'drizzle-orm';
import { db } from '@/db';
import {
	Blog,
	NewBlog,
	blogHeadings,
	blogParagraphs,
	blogs,
} from '@/db/schemas/blog.schema';
import { blogImages, images } from '@/db/schemas/images.schema';
import {
	BlogData,
	BlogElement,
	HeadingElement,
	ImageElement,
	ParagraphElement,
} from '@wirralbears/types';
import { BlogPreview } from '@/types/blog.types';
import { users } from '@/db/schema';

export const blogRepository = {
	async findAll() {
		const lowestPositionImages = db
			.select({
				blogId: blogImages.blogId,
				minPosition: sql`MIN(${blogImages.position})`.as('minPosition'),
			})
			.from(blogImages)
			.groupBy(blogImages.blogId)
			.as('lowestPositionImages');

		return db
			.select({
				id: blogs.id,
				title: blogs.title,
				username: users.username,
				createdAt: blogs.createdAt,
				updatedAt: blogs.updatedAt,
				image: {
					id: images.id,
					key: images.key,
					url: images.url,
					authorId: images.authorId,
					alt: images.alt,
				},
			})
			.from(blogs)
			.leftJoin(lowestPositionImages, eq(blogs.id, lowestPositionImages.blogId))
			.leftJoin(
				blogImages,
				and(
					eq(blogs.id, blogImages.blogId),
					eq(blogImages.position, lowestPositionImages.minPosition)
				)
			)
			.leftJoin(images, eq(blogImages.imageId, images.id))
			.leftJoin(users, eq(blogs.authorId, users.id))
			.orderBy(blogs.createdAt);
	},

	async getBlogById(blogId: string) {
		// Get the main blog and author
		const blogResult = await db
			.select({
				blog: {
					id: blogs.id,
					title: blogs.title,
					authorId: blogs.authorId,
					createdAt: blogs.createdAt,
					updatedAt: blogs.updatedAt,
				},
				author: {
					id: users.id,
					username: users.username,
				},
			})
			.from(blogs)
			.leftJoin(users, eq(blogs.authorId, users.id))
			.where(eq(blogs.id, blogId));

		if (blogResult.length === 0) {
			return null;
		}

		const { blog, author } = blogResult[0];

		// Get headings, paragraphs, and images separately
		const [headings, paragraphs, blogImagesWithDetails] = await Promise.all([
			// Get headings
			db
				.select()
				.from(blogHeadings)
				.where(eq(blogHeadings.blogId, blogId))
				.orderBy(blogHeadings.position),

			// Get paragraphs
			db
				.select()
				.from(blogParagraphs)
				.where(eq(blogParagraphs.blogId, blogId))
				.orderBy(blogParagraphs.position),

			// Get images with their blog relationship
			db
				.select({
					id: images.id,
					key: images.key,
					url: images.url,
					alt: images.alt,
					position: blogImages.position,
				})
				.from(blogImages)
				.leftJoin(images, eq(blogImages.imageId, images.id))
				.where(eq(blogImages.blogId, blogId))
				.orderBy(blogImages.position),
		]);

		return {
			...blog,
			author,
			headings: headings || [],
			paragraphs: paragraphs || [],
			images: blogImagesWithDetails || [],
		};
	},

	async createBlogWithTransaction(
		title: string,
		authorId: string,
		headings: HeadingElement[],
		paragraphs: ParagraphElement[],
		imageReferences: { imageId: string; position: number }[]
	): Promise<Blog> {
		return await db.transaction(async (tx) => {
			// Insert main blog
			const [blog] = await tx
				.insert(blogs)
				.values({
					title,
					authorId,
				})
				.returning();

			// Insert headings
			if (headings.length > 0) {
				await tx.insert(blogHeadings).values(
					headings.map((heading) => ({
						text: heading.text,
						blogId: blog.id,
						position: heading.position ?? 0,
					}))
				);
			}

			// Insert paragraphs
			if (paragraphs.length > 0) {
				await tx.insert(blogParagraphs).values(
					paragraphs.map((paragraph) => ({
						text: paragraph.text,
						blogId: blog.id,
						position: paragraph.position ?? 0,
					}))
				);
			}

			// Insert blog-image relationships
			if (imageReferences.length > 0) {
				await tx.insert(blogImages).values(
					imageReferences.map((ref) => ({
						blogId: blog.id,
						imageId: ref.imageId,
						position: ref.position,
					}))
				);
			}

			return blog;
		});
	},

	async updateBlog(
		id: string,
		blog: Partial<NewBlog>
	): Promise<Blog | undefined> {
		const result = await db
			.update(blogs)
			.set({ ...blog, updatedAt: new Date() })
			.where(eq(blogs.id, id))
			.returning();
		return result[0];
	},

	async deleteBlog(id: string): Promise<boolean> {
		const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();
		return result.length > 0;
	},
};
