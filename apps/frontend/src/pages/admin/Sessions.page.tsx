import SessionDayComponent from '@/components/sessions/edit/SessionDay';
import { useGetFullSchedule } from '@/hooks/session.hooks';
import { FullSessionSchedule } from '@wirralbears/backend-types';
import { SessionDayWithSessions } from '@wirralbears/types';

export default function EditSessionsPage() {
	const { data: fullSchedule, isLoading } = useGetFullSchedule();
	const schedule = fullSchedule as FullSessionSchedule;
console.log(schedule)
	return (
		<>
			<h1 className="text-2xl font-bold mb-4">Edit Sessions</h1>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{schedule.sessionDays.map((sessionDay) => (
						<SessionDayComponent key={sessionDay.id} sessionDay={sessionDay} />
					))}
				</div>
			)}
		</>
	);
}
