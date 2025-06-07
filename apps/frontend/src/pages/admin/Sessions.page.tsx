import { useState, useEffect } from 'react';
import SessionDayComponent from '@/components/sessions/edit/SessionDay';
import SaveSessions from '@/components/sessions/edit/SaveSessions';
import {
	useGetFullSchedule,
	useUpdateFullSchedule,
} from '@/hooks/session.hooks';
import { FullSessionSchedule } from '@wirralbears/backend-types';

export default function EditSessionsPage() {
	const { data: fullSchedule, isLoading } = useGetFullSchedule();
	const { mutate: updateFullSchedule } = useUpdateFullSchedule();

	// Local state for editing sessions
	const [schedule, setSchedule] = useState<FullSessionSchedule | null>(null);

	// Initialize local state when data is loaded
	useEffect(() => {
		if (fullSchedule) setSchedule(fullSchedule);
	}, [fullSchedule]);

	// Update sessions for a specific day
	const updateSessionDay = (sessionDayId: string, newSessions: any[]) => {
		if (!schedule) return;
		setSchedule({
			...schedule,
			sessionDays: schedule.sessionDays.map((day) =>
				day.id === sessionDayId ? { ...day, sessions: newSessions } : day
			),
		});
	};

	// Save all changes (additions, deletions, edits)
	const saveSessions = () => {
		if (schedule) {
			console.log(schedule);
			updateFullSchedule(schedule);
		}
	};

	return (
		<>
			<h1>Edit Sessions</h1>
			{isLoading || !schedule ? (
				<p>Loading...</p>
			) : (
				<>
					<div>
						{schedule.sessionDays.map((sessionDay) => (
							<SessionDayComponent
								key={sessionDay.id}
								sessionDay={sessionDay}
								onSessionsChange={(newSessions) =>
									updateSessionDay(sessionDay.id, newSessions)
								}
							/>
						))}
					</div>
					<SaveSessions
						onClick={saveSessions}
						onSuccess={() => console.log('success')}
					/>
				</>
			)}
		</>
	);
}
