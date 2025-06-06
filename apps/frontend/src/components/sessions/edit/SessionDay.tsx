import { SessionDayWithSessions } from '@wirralbears/backend-types';
import SessionComponent from './Session';
import { useState } from 'react';

export default function SessionDayComponent({
	sessionDay,
}: {
	sessionDay: SessionDayWithSessions;
}) {
  const [sessions, setSessions] = useState(sessionDay.sessions);

  function deleteHandler() {
    sessionDay.sessions = sessionDay.sessions.filter((session) => session.id !== sessionDay.sessions[0].id);
    setSessions(sessionDay.sessions);
  }

	return (
		<div className="flex flex-col border-gray-900">
			<h2>{sessionDay.day}</h2>
			<ul>
				{sessions.map((session) => (
					<SessionComponent key={session.id} session={session} onDelete={deleteHandler} />
				))}
			</ul>
		</div>
	);
}
