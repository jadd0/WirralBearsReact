import { useGetAllBlogPreviews } from '@/hooks/blog.hooks';
import BlogAllPreviews from '@/components/blog/BlogAllPreviews';
import { Footer } from '@/components/layout/Footer';
import { LogoBanner } from '@/components/layout/LogoBanner';

export default function ViewBlogsPage() {
	const { data, isLoading } = useGetAllBlogPreviews();

	return (
		<div className="container min-w-full mx-auto">
			<LogoBanner />
			<header className="mb-8 text-center">
				<h1 className="text-4xl font-bold text-gray-900 mb-2">Latest Blogs</h1>
				<p className="text-lg text-gray-600">
					Discover our latest articles and insights
				</p>
			</header>

			<BlogAllPreviews isLoading={isLoading} blogs={data || []} />
			<Footer />
		</div>
	);
}
