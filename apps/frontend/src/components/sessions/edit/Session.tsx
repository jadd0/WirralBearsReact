import { Session } from '@wirralbears/backend-types';
import SessionDelete from './SessionDelete';
import { SessionDropdown } from './SessionDropdown';
import { GENDER, SESSION_AGE_GROUPS } from '@wirralbears/constants';
import { useGetAllCoachPreviews } from '@/hooks/coach.hooks';

export default function SessionComponent({
	session,
	onDelete,
	onEdit,
}: {
	session: Session;
	onDelete: () => void;
	onEdit: (updatedSession: Session) => void;
}) {
	const { data: coaches, isLoading } = useGetAllCoachPreviews();

	const handleUpdate = (newValues: Partial<Session>) => {
		const updatedSession = { ...session, ...newValues };
		onEdit(updatedSession);
	};

	let coachNames: string[] = [];
	if (!isLoading && coaches) {
		coachNames = coaches.map((coach) => coach.title);
	}

	const timeSlots = Array.from({ length: 48 }, (_, i) => {
		const hour = String(Math.floor(i / 2)).padStart(2, '0');
		const min = i % 2 === 0 ? '00' : '30';
		return `${hour}:${min}`;
	});

	return (
		<li className="flex flex-wrap items-center gap-3 bg-gray-50 rounded-lg p-3 shadow-sm">
			<SessionDropdown
				title="Time"
				values={timeSlots}
				currentValue={session.time}
				onClick={(value) => handleUpdate({ time: value })}
				id={session.id}
			/>
			<SessionDropdown
				title="Gender"
				values={GENDER}
				currentValue={session.gender}
				onClick={(value) => handleUpdate({ gender: value })}
				id={session.id}
			/>
			<SessionDropdown
				title="Age"
				values={SESSION_AGE_GROUPS}
				currentValue={session.age}
				onClick={(value) => handleUpdate({ age: value })}
				id={session.id}
			/>
			<SessionDropdown
				title="Lead Coach"
				values={coachNames}
				currentValue={
					coaches?.find((c) => c.id === session.leadCoach)?.title || ''
				}
				onClick={(value) =>
					handleUpdate({
						leadCoach: coaches?.find((c) => c.title === value)?.id,
					})
				}
				id={session.id}
			/>
			<SessionDelete sessionId={session.id} onClick={onDelete} />
		</li>
	);
}
