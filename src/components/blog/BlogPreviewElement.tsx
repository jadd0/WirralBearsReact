'use client';

import Link from 'next/link';
import { BlogPreview } from '@/server/types/blog.types';

export default function BlogPreviewElement({ blog }: { blog: BlogPreview }) {
	return (
		<Link
			href={`/blog/blog/${blog.id}`}
			className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)]"
		>
			<div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-2">
				{blog.image?.url ? (
					// The CMS serves arbitrary remote URLs, so this stays a plain img.
					<img
						src={blog.image.url}
						alt={blog.image.alt ?? ''}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<span className="font-display text-sm font-bold tracking-[0.16em] text-ink-4 uppercase">
							Wirral Bears
						</span>
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col p-6">
				<h3 className="font-display text-lg leading-snug font-extrabold text-ink transition-colors duration-200 group-hover:text-brand">
					{blog.title}
				</h3>

				{/* Pinned to the bottom so the meta row lines up across cards. */}
				<div className="mt-auto flex items-center gap-2 pt-5 text-[13px] text-ink-4">
					<time dateTime={new Date(blog.createdAt).toISOString()}>
						{new Date(blog.createdAt).toLocaleDateString('en-GB', {
							day: 'numeric',
							month: 'short',
							year: 'numeric',
						})}
					</time>
					{blog.username && (
						<>
							<span aria-hidden="true">&middot;</span>
							<span>{blog.username}</span>
						</>
					)}
				</div>
			</div>
		</Link>
	);
}
