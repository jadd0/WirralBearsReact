import { Session } from '@wirralbears/backend-types';
import SessionDelete from './SessionDelete';
import { SessionDropdown } from './SessionDropdown';
import { GENDER, SESSION_AGE_GROUPS } from '@wirralbears/constants';
import { useGetAllCoachPreviews } from '@/hooks/coach.hooks';
import { useEffect, useState } from 'react';
import { coach } from '@/queries/coach.queries';

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

	// Create handler for updates
	const handleUpdate = (newValues: Partial<Session>) => {
		const updatedSession = { ...session, ...newValues };
		onEdit(updatedSession);
	};

	let coachNames;

	if (!isLoading) {
		coachNames = coaches?.map((coach) => coach.title);
	}

	const timeSlots = [
		'00:00',
		'00:30',
		'01:00',
		'01:30',
		'02:00',
		'02:30',
		'03:00',
		'03:30',
		'04:00',
		'04:30',
		'05:00',
		'05:30',
		'06:00',
		'06:30',
		'07:00',
		'07:30',
		'08:00',
		'08:30',
		'09:00',
		'09:30',
		'10:00',
		'10:30',
		'11:00',
		'11:30',
		'12:00',
		'12:30',
		'13:00',
		'13:30',
		'14:00',
		'14:30',
		'15:00',
		'15:30',
		'16:00',
		'16:30',
		'17:00',
		'17:30',
		'18:00',
		'18:30',
		'19:00',
		'19:30',
		'20:00',
		'20:30',
		'21:00',
		'21:30',
		'22:00',
		'22:30',
		'23:00',
		'23:30',
	];

	return (
		<div className="flex flex row">
			<SessionDropdown
				title={'Time'}
				values={timeSlots}
				currentValue={session.time}
				onClick={(value) => handleUpdate({ time: value })}
			/>
			<SessionDropdown
				title={'Gender'}
				values={GENDER}
				currentValue={session.gender}
				onClick={(value) => handleUpdate({ gender: value })}
			/>
			<SessionDropdown
				title={'Age'}
				values={SESSION_AGE_GROUPS}
				currentValue={session.age}
				onClick={(value) => handleUpdate({ age: value })}
			/>
			<SessionDropdown
				title={'Lead Coach'}
				values={coachNames}
				currentValue={coaches?.filter((c) => c.id === session.leadCoach)[0]?.title}
				onClick={(value) => handleUpdate({leadCoach: coaches?.filter((c) => c.title === value)[0]?.id})}
			/>
			<div className="flex-none">
				<SessionDelete sessionId={session.id} onClick={onDelete} />
			</div>
		</div>
	);
}
