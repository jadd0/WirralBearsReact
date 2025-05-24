export default function BlogSkeleton() {
	return (
		<div className="flex flex-col gap-4 animate-pulse">
			{/* Header skeleton */}
			<div className="flex flex-col gap-3">
				{/* Title skeleton */}
				<div className="h-10 bg-gray-200 rounded w-3/4"></div>

				{/* Author and date skeleton */}
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-gray-200 rounded"></div>
						<div className="h-4 bg-gray-200 rounded w-20"></div>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-gray-200 rounded"></div>
						<div className="h-4 bg-gray-200 rounded w-24"></div>
					</div>
				</div>
			</div>

			{/* Content skeleton */}
			<div className="flex flex-col gap-4 mt-4">
				{/* First heading */}
				<div className="h-8 bg-gray-200 rounded w-1/2"></div>

				{/* First paragraph */}
				<div className="space-y-2 max-w-[300px]">
					<div className="h-4 bg-gray-200 rounded"></div>
					<div className="h-4 bg-gray-200 rounded w-5/6"></div>
					<div className="h-4 bg-gray-200 rounded w-4/6"></div>
				</div>

				{/* Image skeleton */}
				<div className="h-48 bg-gray-200 rounded max-w-[400px]"></div>

				{/* Second heading */}
				<div className="h-8 bg-gray-200 rounded w-2/5"></div>

				{/* Second paragraph */}
				<div className="space-y-2 max-w-[300px]">
					<div className="h-4 bg-gray-200 rounded"></div>
					<div className="h-4 bg-gray-200 rounded w-4/5"></div>
				</div>
			</div>
		</div>
	);
}
