'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useGetBlog } from '@hooks/blog.hooks';
import { useMe } from '@hooks/auth.hooks';
import BlogHeader from './BlogHeader';
import BlogContent from './BlogContent';
import BlogSkeleton from './BlogSkeleton';
import AdminActions from './AdminActions';
import { FullBlog } from '@wirralbears/backend-types';

export default function BlogDisplay({ id }: { id: string }) {
	const { data, isLoading, error } = useGetBlog(id);
	const { data: auth } = useMe();
	const blogData = data as FullBlog;

	if (error) {
		toast.error('Failed to load blog post. Please try again later.');
	}

	return (
		<article className="section">
			<div className="container-page">
				<div className="container-prose mx-0">
					<Link
						href="/blog/blogs"
						className="text-[15px] font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-strong hover:underline"
					>
						&larr; All posts
					</Link>

					{auth?.authenticated && blogData && (
						<div className="mt-6">
							<AdminActions id={id} coach={false} />
						</div>
					)}

					<div className="mt-8">
						{isLoading ? (
							<BlogSkeleton />
						) : blogData ? (
							<>
								<BlogHeader
									title={blogData.title}
									author={blogData.author}
									createdAt={blogData.createdAt}
								/>
								<div className="mt-10">
									<BlogContent
										headings={blogData.headings}
										paragraphs={blogData.paragraphs}
										images={blogData.images}
									/>
								</div>
							</>
						) : (
							<NotFoundNotice
								title="We couldn't find that post"
								href="/blog/blogs"
								label="Back to all posts"
							/>
						)}
					</div>
				</div>
			</div>
		</article>
	);
}

export function NotFoundNotice({
	title,
	href,
	label,
}: {
	title: string;
	href: string;
	label: string;
}) {
	return (
		<div className="rounded-3xl border border-dashed border-line-strong bg-paper-2/60 px-8 py-16 text-center">
			<h1 className="font-display text-xl font-extrabold text-ink">{title}</h1>
			<p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-3">
				It may have been removed, or the link may be out of date.
			</p>
			<Link
				href={href}
				className="mt-7 inline-flex rounded-xl border border-line-strong bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-paper"
			>
				{label}
			</Link>
		</div>
	);
}
