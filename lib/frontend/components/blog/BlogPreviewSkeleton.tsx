export default function CoachPreviewSkeleton() {
	return (
		<div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4 min-w-[250px] animate-pulse">
			{/* Image skeleton */}
			<div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0" />
			{/* Title skeleton */}
			<div className="h-6 bg-gray-300 rounded w-3/4" />
		</div>
	);
}
