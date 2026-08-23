'use client';

import { CoachPreview } from '@wirralbears/backend-types';
import CoachPreviewElement from './CoachPreviewElement';
import CoachPreviewSkeleton from './CoachPreviewSkeleton';

export default function CoachAllPreviews({
	coaches,
	isLoading,
}: {
	coaches: CoachPreview[];
	isLoading: boolean;
}) {
	if (isLoading) {
		return (
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<CoachPreviewSkeleton key={`skeleton-${index}`} />
				))}
			</div>
		);
	}

	if (coaches.length === 0) {
		return (
			<div className="rounded-3xl border border-dashed border-line-strong bg-paper-2/60 px-8 py-16 text-center">
				<h2 className="font-display text-xl font-extrabold text-ink">
					Coach profiles are on the way
				</h2>
				<p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-3">
					You will meet the coaching team at your first session. Turn up to the
					one for your age group, or email the club with any questions.
				</p>
				<a
					href="mailto:wirralbears@gmail.com"
					className="mt-7 inline-flex rounded-xl border border-line-strong bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-paper"
				>
					Email the club
				</a>
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{coaches.map((coach) => (
				<CoachPreviewElement key={coach.id} coach={coach} />
			))}
		</div>
	);
}
