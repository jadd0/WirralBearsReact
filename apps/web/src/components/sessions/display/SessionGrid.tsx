'use client';

import { FullSessionSchedule } from '@wirralbears/backend-types';
import { useGetAllCoachPreviews } from '@hooks/coach.hooks';
import SessionDay from './SessionDay';

export default function SessionGrid({
	schedule,
}: {
	schedule?: FullSessionSchedule;
}) {
	const { data: coaches, isLoading: coachesLoading } = useGetAllCoachPreviews();

	if (!schedule?.sessionDays?.length) return null;

	// Days stack in order rather than sitting in a grid. A grid would either
	// size every row to the busiest day, or reflow the week out of sequence.
	return (
		<div className="flex flex-col gap-4">
			{!coachesLoading &&
				schedule.sessionDays.map((sessionDay) => (
					<SessionDay
						key={sessionDay.id}
						sessionDay={sessionDay}
						coaches={coaches || []}
					/>
				))}
		</div>
	);
}
