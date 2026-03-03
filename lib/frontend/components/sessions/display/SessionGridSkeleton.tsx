import { Skeleton } from '@/components/ui/skeleton';

export default function SessionGridSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
			{[...Array(6)].map((_, idx) => (
				<div key={idx} className="bg-white rounded-xl p-6 space-y-4">
					<Skeleton className="h-7 w-1/2" />
					<div className="space-y-3">
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
					</div>
				</div>
			))}
		</div>
	);
}
