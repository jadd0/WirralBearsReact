import { BlogPreview } from '@wirralbears/backend-types';

export default function BlogPreviewElement({ blog }: { blog: BlogPreview }) {
	return (
		<div className="flex flex-row p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
			{/* Blog image */}
			<div className="w-32 h-24 flex-shrink-0">
				<img
					src={blog.image?.url ?? '/placeholder-image.jpg'}
					alt={blog.image?.alt ?? 'Blog preview'}
					className="w-full h-full object-cover rounded-md"
				/>
			</div>

			{/* Blog content */}
			<div className="flex flex-col ml-4 flex-1">
				<h2 className="text-xl font-semibold text-gray-900 mb-2">
					{blog.title}
				</h2>
				<p className="text-sm text-gray-600 mb-1">
					{new Date(blog.createdAt).toLocaleDateString()}
				</p>
				<p className="text-sm text-gray-500">Author: {blog.username}</p>
			</div>
		</div>
	);
}
