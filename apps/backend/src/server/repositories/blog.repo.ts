// src/repositories/blogRepository.ts
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { Blog, NewBlog, blogs } from '@/db/schemas/blog.schema';

export const blogRepository = {
	async findAll(): Promise<Blog[]> {
		return db.select().from(blogs).orderBy(blogs.createdAt);
	},

	async getBlogById(id: number): Promise<Blog | undefined> {
		const result = await db.select().from(blogs).where(eq(blogs.id, id));
		return result[0];
	},

	async create(blog: NewBlog): Promise<Blog> {
		const result = await db.insert(blogs).values(blog).returning();
		return result[0];
	},

	async updateBlog(
		id: number,
		blog: Partial<NewBlog>
	): Promise<Blog | undefined> {
		const result = await db
			.update(blogs)
			.set({ ...blog, updatedAt: new Date() })
			.where(eq(blogs.id, id))
			.returning();
		return result[0];
	},

	async deleteBlog(id: number): Promise<boolean> {
		const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();
		return result.length > 0;
	},
};
