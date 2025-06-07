import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SessionDayWithSessions, Session } from '@wirralbears/backend-types';
import SessionComponent from './Session';
import AddSession from './AddSession';

export default function SessionDayComponent({
	sessionDay,
	onSessionsChange,
}: {
	sessionDay: SessionDayWithSessions;
	onSessionsChange: (newSessions: Session[]) => void;
}) {
	const [sessions, setSessions] = useState<Session[]>(
		() => sessionDay.sessions ?? []
	);

	// Only sync with parent when sessions change locally
	useEffect(() => {
		onSessionsChange(sessions);
	}, [sessions]);

	const handleEditSession = (updatedSession: Session) => {
		setSessions((prev) =>
			prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
		);
	};

	const handleDeleteSession = (sessionId: string) => {
		setSessions((prevSessions) =>
			prevSessions.filter((session) => session.id !== sessionId)
		);
	};

	const addNewSession = () => {
		setSessions((prev) => [
			...prev,
			{
				id: '',
				day: sessionDay.id,
				time: '09:00',
				age: 5,
				gender: 'Mixed',
				leadCoach: '',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	};

	return (
		<div className="session-day">
			<h2>{sessionDay.day}</h2>
			<ul>
				{sessions.map((session) => (
					<SessionComponent
						key={session.id}
						session={session}
						onDelete={() => handleDeleteSession(session.id)}
						onEdit={handleEditSession}
					/>
				))}
			</ul>
			<AddSession onClick={addNewSession} />
		</div>
	);
}
