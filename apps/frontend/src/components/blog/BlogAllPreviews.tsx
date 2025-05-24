import { BlogPreview } from '../../../../backend/src/types/blog.types';
import BlogPreviewElement from './BlogPreviewElement';
import BlogPreviewSkeleton from './BlogPreviewSkeleton';

export default function BlogAllPreviews({
	blogs,
	isLoading,
}: {
	blogs: BlogPreview[];
	isLoading: boolean;
}) {
	return (
		<div className="flex flex-col space-y-4">
			{isLoading
				? // Show multiple skeleton items while loading
				  Array.from({ length: 6 }).map((_, index) => (
						<BlogPreviewSkeleton key={index} />
				  ))
				:
				  blogs.map((blog) => <BlogPreviewElement key={blog.id} blog={blog} />)}
		</div>
	);
}
