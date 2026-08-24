'use client';

/** Matches the shape of BlogPreviewElement so the layout does not shift. */
export default function BlogPreviewSkeleton() {
	return (
		<div className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-line bg-surface">
			<div className="aspect-[16/10] w-full bg-paper-2" />
			<div className="flex flex-1 flex-col p-6">
				<div className="h-5 w-11/12 rounded bg-paper-2" />
				<div className="mt-2 h-5 w-2/3 rounded bg-paper-2" />
				<div className="mt-auto pt-5">
					<div className="h-3.5 w-32 rounded bg-paper-2" />
				</div>
			</div>
		</div>
	);
}
