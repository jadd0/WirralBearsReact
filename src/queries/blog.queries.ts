import { api } from '@/api/api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const blog = createQueryKeys('blog', {
	getBlogById: (id: string) => ({
		queryFn: async () => await api.blog.fetchBlog(id),
		queryKey: ['blog', 'getById', id],
	}),
	getAllBlogPreviews: () => ({
		queryFn: async () => await api.blog.getAllBlogPreviews(),
		queryKey: ['blog', 'getAllBlogPreviews'],
	}),
	deleteBlog: (id: string) => ({
		queryFn: async () => await api.blog.deleteBlog(id),
		queryKey: ['blog', 'delete', id]
	})
});
