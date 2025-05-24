import { useGetBlog } from '@/hooks/blog.hooks';
import { blog } from '@/queries/blog.queries';
import { toast } from 'sonner';
import { FullBlog } from '@wirralbears/backend-types';

export default function BlogDisplay({ id }: { id: string }) {
	const { data, isLoading, error } = useGetBlog(id);
	const blogData = data as FullBlog;

  console.log(data)

	if (error) {
		toast.error('Failed to load blog post. Please try again later.');
	}


	return (
		<>
			<main>
				<div className="container mx-auto px-4 py-8">
					{isLoading ? (
						<p>Loading...</p>
					) : (
						<div className="flex-col justify-center align-middle">
							<h1>{blogData?.title}</h1>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
