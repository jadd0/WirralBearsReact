'use client';

/** Matches the article layout so nothing jumps when the post lands. */
export default function BlogSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="border-b border-line pb-8">
				<div className="h-11 w-11/12 rounded bg-paper-2" />
				<div className="mt-3 h-11 w-2/3 rounded bg-paper-2" />
				<div className="mt-6 h-4 w-56 rounded bg-paper-2" />
			</div>
			<div className="mt-10 flex flex-col gap-4">
				<div className="h-4 w-full rounded bg-paper-2" />
				<div className="h-4 w-11/12 rounded bg-paper-2" />
				<div className="h-4 w-4/6 rounded bg-paper-2" />
				<div className="mt-4 h-56 w-full rounded-2xl bg-paper-2" />
				<div className="mt-4 h-4 w-full rounded bg-paper-2" />
				<div className="h-4 w-5/6 rounded bg-paper-2" />
			</div>
		</div>
	);
}
