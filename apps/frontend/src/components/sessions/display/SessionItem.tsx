import { SessionWithCoach } from '@wirralbears/backend-types';
import { Link } from 'react-router-dom';

export default function SessionItem({
	session,
	coach,
}: {
	session: SessionWithCoach;
	coach: any;
}) {
	return (
		<div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start gap-5">
				<div>
					<h3 className="text-lg font-semibold text-gray-800">
						{session.time} - {session.age} years
					</h3>
					<p className="text-gray-600">{session.gender} group</p>
				</div>
				<div className="text-right">
					{' '}
					<Link to={{ pathname: `/coaches/coach/${coach.id}` }}>
						<p className="font-medium text-blue-600 cursor-pointer">
							{coach.title}
						</p>
					</Link>
					<p className="text-sm text-gray-500">Lead Coach</p>
				</div>
			</div>
		</div>
	);
}
