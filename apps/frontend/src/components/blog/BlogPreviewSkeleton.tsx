export default function BlogPreviewSkeleton() {
	return (
		<div className="flex flex-row p-4 border border-gray-200 rounded-lg animate-pulse">
			{/* Image skeleton */}
			<div className="w-32 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>

			{/* Content skeleton */}
			<div className="flex flex-col ml-4 flex-1 space-y-3">
				{/* Title skeleton */}
				<div className="h-6 bg-gray-300 rounded w-3/4"></div>

				{/* Date skeleton */}
				<div className="h-4 bg-gray-300 rounded w-1/4"></div>

				{/* Author skeleton */}
				<div className="h-4 bg-gray-300 rounded w-1/3"></div>
			</div>
		</div>
	);
}
