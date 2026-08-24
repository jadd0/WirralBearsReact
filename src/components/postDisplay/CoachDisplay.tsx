'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useGetCoach } from '@hooks/coach.hooks';
import { useSession } from 'next-auth/react';
import BlogContent from './BlogContent';
import BlogSkeleton from './BlogSkeleton';
import AdminActions from './AdminActions';
import { NotFoundNotice } from './BlogDisplay';
import { FullBlog } from '@/server/types/blog.types';

export default function CoachDisplay({ id }: { id: string }) {
	const { data, isLoading, error } = useGetCoach(id);
	const { data: session } = useSession();
	const coachData = data as FullBlog;

	if (error) {
		toast.error('Failed to load coach profile. Please try again later.');
	}

	return (
		<article className="section">
			<div className="container-page">
				<div className="container-prose mx-0">
					<Link
						href="/coaches"
						className="text-[15px] font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-strong hover:underline"
					>
						&larr; All coaches
					</Link>

					{session?.user?.isAdmin && coachData && (
						<div className="mt-6">
							<AdminActions id={id} coach={true} />
						</div>
					)}

					<div className="mt-8">
						{isLoading ? (
							<BlogSkeleton />
						) : coachData ? (
							<>
								<h1 className="border-b border-line pb-8 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-extrabold tracking-[-0.035em] text-ink">
									{coachData.title}
								</h1>
								<div className="mt-10">
									<BlogContent
										headings={coachData.headings}
										paragraphs={coachData.paragraphs}
										images={coachData.images}
									/>
								</div>
							</>
						) : (
							<NotFoundNotice
								title="We couldn't find that coach"
								href="/coaches"
								label="Back to all coaches"
							/>
						)}
					</div>
				</div>
			</div>
		</article>
	);
}
