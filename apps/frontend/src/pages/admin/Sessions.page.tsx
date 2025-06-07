import { useState, useEffect } from 'react';
import SessionDayComponent from '@/components/sessions/edit/SessionDay';
import SaveSessions from '@/components/sessions/edit/SaveSessions';
import {
	useGetFullSchedule,
	useUpdateFullSchedule,
} from '@/hooks/session.hooks';
import { FullSessionSchedule } from '@wirralbears/backend-types';
import { validateFullSchedule } from '@wirralbears/validation/src/session.validation';
import { sessionToasts } from '@/lib/toasts';

export default function EditSessionsPage() {
	const { data: fullSchedule, isLoading } = useGetFullSchedule();
	const { mutate: updateFullSchedule } = useUpdateFullSchedule();
	const [schedule, setSchedule] = useState<FullSessionSchedule | null>(null);

	useEffect(() => {
		if (fullSchedule) setSchedule(fullSchedule as FullSessionSchedule);
	}, [fullSchedule]);

	const updateSessionDay = (sessionDayId: string, newSessions: any[]) => {
		if (!schedule) return;
		setSchedule({
			...schedule,
			sessionDays: schedule.sessionDays.map((day) =>
				day.id === sessionDayId ? { ...day, sessions: newSessions } : day
			),
		});
	};

	const saveSessions = () => {
		if (!schedule) return;

		try {
			validateFullSchedule(schedule);
			updateFullSchedule(schedule); 
		} catch (error) {
			if (error instanceof Error) {
				sessionToasts.validationError(error);
			}
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8 text-center">Edit Sessions</h1>
			{isLoading || !schedule ? (
				<div className="flex justify-center items-center h-40">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				</div>
			) : (
				<>
					<div className="space-y-8">
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
					<div className="flex justify-end mt-10">
						<SaveSessions
							onClick={saveSessions}
							onSuccess={() => console.log('success')}
						/>
					</div>
				</>
			)}
		</div>
	);
}
