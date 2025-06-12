import { useGetCoach } from '@/hooks/coach.hooks';
import { useMe } from '@/hooks/auth.hooks';
import { toast } from 'sonner';
import BlogContent from './BlogContent';
import BlogSkeleton from './BlogSkeleton';
import AdminActions from './AdminActions';
import { FullBlog } from '@wirralbears/backend-types';

export default function CoachDisplay({ id }: { id: string }) {
	const { data, isLoading, error } = useGetCoach(id);
	const { data: auth } = useMe();
	const blogData = data as FullBlog;
	console.log(blogData);

	if (error) {
		toast.error('Failed to load coach profile. Please try again later.');
	}

	return (
		<main className="w-full">
			<div
				className="w-full pl-[40px] pr-4 py-8"
				style={{ marginLeft: 0, marginRight: 'auto' }}
			>
				{auth?.authenticated && blogData && (
					<AdminActions id={id} data={blogData} coach={true} />
				)}
				<div className="flex flex-col gap-4 w-full">
					{isLoading ? (
						<BlogSkeleton />
					) : blogData ? (
						<>
							<BlogContent
								headings={blogData.headings}
								paragraphs={blogData.paragraphs}
								images={blogData.images}
							/>
						</>
					) : (
						<p>Coach profile not found.</p>
					)}
				</div>
			</div>
		</main>
	);
}
