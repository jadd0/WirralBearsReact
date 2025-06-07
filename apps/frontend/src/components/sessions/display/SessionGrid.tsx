import { FullSessionSchedule } from '@wirralbears/backend-types';
import { useGetAllCoachPreviews } from '@/hooks/coach.hooks';
import SessionDay from './SessionDay';

export default function SessionGrid({
	schedule,
}: {
	schedule?: FullSessionSchedule;
}) {
	const { data: coaches, isLoading: coachesLoading } = useGetAllCoachPreviews();

	if (!schedule?.sessionDays?.length) return null;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
