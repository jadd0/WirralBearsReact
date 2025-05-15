import { blogRepository } from '../repositories/blog.repo';
import { Blog, NewBlog } from '@/db/schemas/blog.schema';
import { BlogData } from '@wirralbears/types';

export const blogServices = {
	async getAllBlogs(): Promise<Blog[]> {
		return blogRepository.findAll();
	},

	async getBlogById(id: number): Promise<Blog> {
		const blog = await blogRepository.getBlogById(id);

		if (!blog) {
			throw new Error('Blog not found');
		}
		return blog;
	},

	async createBlog(authorId: number, blogData: BlogData): Promise<Blog> {
		const newBlog: NewBlog = {
			title: extractTitle(blogData),
			content: blogData,
			authorId,
		};

		return blogRepository.create(newBlog);
	},

	async updateBlog(id: number, blogData: BlogData): Promise<Blog> {
		const blog = await blogRepository.getBlogById(id);

		if (!blog) {
			throw new Error('Blog not found');
		}

		const updatedBlog = await blogRepository.updateBlog(id, {
			title: extractTitle(blogData),
			content: blogData,
		});

		if (!updatedBlog) {
			throw new Error('Failed to update blog');
		}

		return updatedBlog;
	},

	async deleteBlog(id: number): Promise<boolean> {
		const deleted = await blogRepository.deleteBlog(id);
		if (!deleted) {
			throw new Error('Blog not found or could not be deleted');
		}
		return true;
	},
};

// Helper function to extract title from blog data
function extractTitle(blogData: BlogData): string {
	// Find the first heading element to use as title
	const headingElement = blogData.elements.find((el) => el.type === 'heading');
	if (headingElement && 'content' in headingElement) {
		return headingElement.content;
	}
	return 'Untitled Blog';
}
