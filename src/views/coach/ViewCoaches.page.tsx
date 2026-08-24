'use client';

import { useGetAllCoachPreviews } from '@hooks/coach.hooks';
import CoachAllPreviews from '@components/coach/CoachAllPreviews';
import { PageHeader } from '@components/layout/PageHeader';

export default function ViewCoachesPage() {
	const { data, isLoading } = useGetAllCoachPreviews();

	return (
		<>
			<PageHeader
				eyebrow="Coaches"
				title="The people on the sideline"
				lead="Experienced, teacher-led coaches who know every player by name and build the club from the bottom up."
			/>
			<section className="section">
				<div className="container-page">
					<CoachAllPreviews isLoading={isLoading} coaches={data || []} />
				</div>
			</section>
		</>
	);
}
