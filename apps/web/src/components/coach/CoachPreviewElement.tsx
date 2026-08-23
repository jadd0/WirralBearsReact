'use client';

import Link from 'next/link';
import { CoachPreview } from '@wirralbears/backend-types';

export default function CoachPreviewElement({
	coach,
}: {
	coach: CoachPreview;
}) {
	return (
		<Link
			href={`/coaches/coach/${coach.id}`}
			className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)]"
		>
			<div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-2">
				{coach.image?.url ? (
					// Coach photos are arbitrary remote CMS URLs.
					<img
						src={coach.image.url}
						alt={coach.image.alt ?? ''}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
					/>
				) : (
					<div className="grain flex h-full w-full items-center justify-center bg-ink">
						<span className="font-display text-sm font-bold tracking-[0.16em] text-white/25 uppercase">
							Wirral Bears
						</span>
					</div>
				)}
			</div>
			<div className="p-6">
				<h3 className="font-display text-lg leading-snug font-extrabold text-ink transition-colors duration-200 group-hover:text-brand">
					{coach.title}
				</h3>
			</div>
		</Link>
	);
}
