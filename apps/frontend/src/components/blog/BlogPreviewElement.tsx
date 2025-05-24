import { BlogPreview } from '@wirralbears/backend-types';
import { Calendar, User } from 'lucide-react';

export default function BlogPreviewElement({ blog }: { blog: BlogPreview }) {
	return (
		<article className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden">
			<div className="flex flex-row">
				{/* Blog image */}
				<div className="relative w-40 h-32 flex-shrink-0">
					<img
						src={blog.image?.url ?? '/placeholder-image.jpg'}
						alt={blog.image?.alt ?? 'Blog preview'}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 group-hover:to-black/10 transition-colors duration-300" />
				</div>

				{/* Blog content */}
				<div className="flex flex-col justify-between p-6 flex-1 min-h-32">
					<div>
						<h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
							{blog.title}
						</h2>
					</div>

					<div className="flex items-center justify-between text-sm text-gray-500">
						<time className="flex items-center gap-1">
							<Calendar />
							{new Date(blog.createdAt).toLocaleDateString('en-GB', {
								day: 'numeric',
								month: 'short',
								year: 'numeric',
							})}
						</time>
						<span className="flex items-center gap-1 font-medium">
							<User />
							{blog.username}
						</span>
					</div>
				</div>
			</div>
		</article>
	);
}
