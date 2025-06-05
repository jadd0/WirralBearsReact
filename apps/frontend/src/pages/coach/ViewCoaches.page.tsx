import { useGetAllCoachPreviews } from '@/hooks/coach.hooks';
import CoachAllPreviews from '@/components/coach/CoachAllPreviews';

export default function ViewCoachesPage() {
	const { data, isLoading } = useGetAllCoachPreviews();

	return (
		<div className="container mx-auto">
			<header className="mb-8 text-center">
				<h1 className="text-4xl font-bold text-gray-900 mb-2">Our Coaches</h1>
				<p className="text-lg text-gray-600">
					Meet our experienced coaches who are here to guide you on your
					basketball journey
				</p>
			</header>

			{/* Passes loading state and coach data to the grid component */}
			<CoachAllPreviews isLoading={isLoading} coaches={data || []} />
		</div>
	);
}
