'use client';

/** Matches CoachPreviewElement so the grid does not shift when data lands. */
export default function CoachPreviewSkeleton() {
	return (
		<div className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-line bg-surface">
			<div className="aspect-[4/3] w-full bg-paper-2" />
			<div className="p-6">
				<div className="h-5 w-3/4 rounded bg-paper-2" />
			</div>
		</div>
	);
}
