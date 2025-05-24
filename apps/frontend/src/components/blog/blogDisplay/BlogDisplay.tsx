import { useGetBlog } from '@/hooks/blog.hooks';
import { toast } from 'sonner';
import { FullBlog } from '@wirralbears/backend-types';
import BlogHeader from './BlogHeader';
import BlogContent from './BlogContent';
import BlogSkeleton from './BlogSkeleton';

export default function BlogDisplay({ id }: { id: string }) {
	const { data, isLoading, error } = useGetBlog(id);
	const blogData = data as FullBlog;

	if (error) {
		toast.error('Failed to load blog post. Please try again later.');
	}

	return (
		<main className="w-full">
			{/* Force full width and explicit left positioning */}
			<div
				className="w-full pl-[60px] pr-4 py-8"
				style={{ marginLeft: 0, marginRight: 'auto' }}
			>
				<div className="flex flex-col gap-4 w-full">
					{isLoading ? (
						<BlogSkeleton />
					) : blogData ? (
						<>
							<BlogHeader
								title={blogData.title}
								author={blogData.author}
								createdAt={blogData.createdAt}
							/>
							<BlogContent
								headings={blogData.headings}
								paragraphs={blogData.paragraphs}
								images={blogData.images}
							/>
						</>
					) : (
						<p>Blog post not found.</p>
					)}
				</div>
			</div>
		</main>
	);
}

