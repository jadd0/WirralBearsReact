import { useGetCoach } from '@/hooks/coach.hooks';
import { useMe } from '@/hooks/auth.hooks';
import { toast } from 'sonner';
import BlogHeader from './BlogHeader';
import BlogContent from './BlogContent';
import BlogSkeleton from './BlogSkeleton';
import AdminActions from './AdminActions';

export default function CoachDisplay({ id }: { id: string }) {
	const { data, isLoading, error } = useGetCoach(id);
	const { data: auth } = useMe();

	if (error) {
		toast.error('Failed to load coach profile. Please try again later.');
	}

	return (
		<main className="w-full">
			<div
				className="w-full pl-[60px] pr-4 py-8"
				style={{ marginLeft: 0, marginRight: 'auto' }}
			>
				{auth?.authenticated && data && (
					<AdminActions id={id} data={data} isCoach={true} />
				)}
				<div className="flex flex-col gap-4 w-full">
					{isLoading ? (
						<BlogSkeleton />
					) : data ? (
						<>
							<BlogHeader
								title={data.title}
								author={data.author}
								createdAt={data.createdAt}
							/>
							<BlogContent
								headings={data.headings}
								paragraphs={data.paragraphs}
								images={data.images}
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
