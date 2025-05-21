import { eq } from 'drizzle-orm';
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
	BlogElement,
	HeadingElement,
	ImageElement,
	ParagraphElement,
} from '@wirralbears/types';

export const blogRepository = {
	async findAll(): Promise<Blog[]> {
		return db.select().from(blogs).orderBy(blogs.createdAt);
	},

	async getBlogById(id: string): Promise<Blog | undefined> {
		const result = await db.select().from(blogs).where(eq(blogs.id, id));
		return result[0];
	},

	async createBlog(
		title: string,
		authorId: string,
		blog: {
			headings: HeadingElement[];
			paragraphs: ParagraphElement[];
			images: { imageId: string; position: number }[];
		}
	): Promise<Blog | boolean> {
		return await db.transaction(async (tx) => {
			try {
				// Insert main blog and get the ID
				const [mainBlog] = await tx
					.insert(blogs)
					.values({
						title,
						authorId,
					})
					.returning();

				if (!mainBlog) return false;

				// Insert blog headings if they exist
				if (blog.headings && blog.headings.length > 0) {
					await tx.insert(blogHeadings).values(
						blog.headings.map((heading) => ({
							text: heading.text,
							blogId: mainBlog.id,
							position: heading.position ?? 0,
						}))
					);
				}

				// Insert blog paragraphs if they exist
				if (blog.paragraphs && blog.paragraphs.length > 0) {
					await tx.insert(blogParagraphs).values(
						blog.paragraphs.map((paragraph) => ({
							text: paragraph.text,
							blogId: mainBlog.id,
							position: paragraph.position ?? 0,
						}))
					);
				}

				// Insert blog images if they exist
				if (blog.images && blog.images.length > 0) {
					await tx.insert(blogImages).values(
						blog.images.map((image) => ({
							blogId: mainBlog.id,
							imageId: image.imageId,
							position: image.position ?? 0,
						}))
					);
				}

				// Return the created blog with its ID
				return mainBlog;
			} catch (error) {
				console.error('Error creating blog:', error);
				return false;
			}
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
