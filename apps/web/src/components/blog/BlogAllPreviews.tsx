'use client';

import Link from 'next/link';
import { BlogPreview } from '@wirralbears/backend-types';
import BlogPreviewElement from './BlogPreviewElement';
import BlogPreviewSkeleton from './BlogPreviewSkeleton';

export default function BlogAllPreviews({
	blogs,
	isLoading,
	limit,
}: {
	blogs: BlogPreview[];
	isLoading: boolean;
	limit?: number;
}) {
	// `limit` previously only shortened the skeleton row while every post still
	// rendered underneath it.
	const visible = limit ? blogs.slice(0, limit) : blogs;

	if (isLoading) {
		return (
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: limit || 6 }).map((_, index) => (
					<BlogPreviewSkeleton key={`skeleton-${index}`} />
				))}
			</div>
		);
	}

	if (visible.length === 0) {
		return (
			<div className="rounded-3xl border border-dashed border-line-strong bg-paper-2/60 px-8 py-16 text-center">
				<h3 className="font-display text-xl font-extrabold text-ink">
					No posts yet
				</h3>
				<p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-3">
					Match reports and club updates will appear here. In the meantime, the
					gallery and session times are the best place to look.
				</p>
				<div className="mt-7 flex flex-wrap justify-center gap-3">
					<Link
						href="/image/viewall"
						className="rounded-xl border border-line-strong bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-paper"
					>
						Browse the gallery
					</Link>
					<Link
						href="/sessions"
						className="rounded-xl border border-line-strong bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-paper"
					>
						See session times
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{visible.map((blog) => (
				<BlogPreviewElement key={blog.id} blog={blog} />
			))}
		</div>
	);
}
