import { useGetAllBlogPreviews } from '@/hooks/blog.hooks';
import BlogAllPreviews from '@/components/blog/BlogAllPreviews';

export default function ViewBlogsPage() {
	const { data, isLoading } = useGetAllBlogPreviews();

	return (
		<>
			<BlogAllPreviews isLoading={isLoading} blogs={data || []} />
		</>
	);
}
