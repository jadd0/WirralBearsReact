import { Session } from '@wirralbears/backend-types';
import SessionDelete from './SessionDelete';
import { SessionDropdown } from './SessionDropdown';
import { GENDER, SESSION_AGE_GROUPS } from '@wirralbears/constants';
import { useGetAllCoachPreviews } from '@/hooks/coach.hooks';
import { useEffect, useState } from 'react';

export default function SessionComponent({
	session,
	onDelete,
}: {
	session: Session;
	onDelete: () => void;
}) {
	const [time, setTime] = useState(session.time);
	const [gender, setGender] = useState(session.gender);
	const [age, setAge] = useState(session.age);
	const [leadCoach, setLeadCoach] = useState(session.leadCoach);

	const { data: coaches, isLoading } = useGetAllCoachPreviews();

	let coachNames;

	if (!isLoading) {
		coachNames = coaches?.map((coach) => coach.title);
	}

	return (
		<div className="flex flex row">
			<SessionDropdown
				title={'Time'}
				onClick={(value) => {
					setTime(value);
				}}
			/>
			<SessionDropdown
				title={'Gender'}
				values={GENDER}
				onClick={(value) => {
					setGender(value);
				}}
			/>
			<SessionDropdown
				title={'Age'}
				values={SESSION_AGE_GROUPS}
				onClick={(value) => {
					setAge(value);
				}}
			/>
			<SessionDropdown
				title={'Lead Coach'}
				values={coachNames}
				onClick={(value) => {
					setLeadCoach(value);
				}}
			/>

			<div className="flex-none">
				<SessionDelete sessionId={session.id} onClick={onDelete} />
			</div>
		</div>
	);
}
