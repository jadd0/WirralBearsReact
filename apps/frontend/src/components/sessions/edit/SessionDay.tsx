import { SessionDayWithSessions } from '@wirralbears/backend-types';
import SessionComponent from './Session';
import { useState } from 'react';
import AddSession from './AddSession';

export default function SessionDayComponent({
	sessionDay,
}: {
	sessionDay: SessionDayWithSessions;
}) {
	const [sessions, setSessions] = useState(sessionDay.sessions);

	function deleteHandler() {
		sessionDay.sessions = sessionDay.sessions.filter(
			(session) => session.id !== sessionDay.sessions[0].id
		);
		setSessions(sessionDay.sessions);
	}

	function addNewSession() {
		const newSession = {
			id: '1',
			day: sessionDay.day ?? '',
			createdAt: new Date(),
			updatedAt: new Date(),
			time: '',
			age: 0,
			gender: 'Mixed' as const,
			leadCoach: '',
		};
		setSessions([...sessions, newSession]);
	}

	return (
		<div className="flex flex-col border-gray-900">
			<h2>{sessionDay.day}</h2>
			<ul>
				{sessions.map((session) => (
					<SessionComponent
						key={session.id}
						session={session}
						onDelete={deleteHandler}
					/>
				))}
			</ul>
			<AddSession onClick={addNewSession} />
		</div>
	);
}
