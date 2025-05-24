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
		<section className="w-full max-w-4xl mx-auto px-4">
			<div className="grid gap-6">
				{isLoading ? (
					// Show skeleton loading state
					Array.from({ length: 6 }).map((_, index) => (
						<BlogPreviewSkeleton key={`skeleton-${index}`} />
					))
				) : blogs.length > 0 ? (
					// Show blog previews
					blogs.map((blog) => <BlogPreviewElement key={blog.id} blog={blog} />)
				) : (
					// Empty state
					<div className="text-center py-16">
						<div className="w-16 h-16 mx-auto mb-4 text-gray-300">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							No blogs found
						</h3>
						<p className="text-gray-500">Check back later for new content!</p>
					</div>
				)}
			</div>
		</section>
	);
}
