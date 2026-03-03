export default function CoachPreviewSkeleton() {
	return (
		<div className="flex flex-col items-center gap-6 bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden p-8 animate-pulse">
			{/* Skeleton image */}
			<div className="w-full aspect-[4/3] rounded-xl bg-gray-200" />
			{/* Skeleton title */}
			<div className="w-3/4 h-7 bg-gray-200 rounded mb-2" />
		</div>
	);
}
