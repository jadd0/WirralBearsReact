'use client';

import Link from 'next/link';
import { CoachPreview } from '@/server/types/coach.types';
import { SessionWithCoach } from '@/db/schema';

export default function SessionItem({
	session,
	coach,
}: {
	session: SessionWithCoach;
	coach?: CoachPreview;
}) {
	return (
		<li className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-paper sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0">
			<div>
				<h3 className="font-display text-[17px] font-extrabold text-ink tabular">
					{session.time}
					{session.endTime ? ` - ${session.endTime}` : ''}
				</h3>
				<p className="mt-1 text-[14px] text-ink-3">
					{session.age} years &middot; {session.gender} group
				</p>
			</div>
			<div className="text-right">
				{/* Sessions can be listed before a lead coach is assigned, so this
				    only becomes a link when there is a coach to link to. */}
				{coach ? (
					<Link
						href={`/coaches/coach/${coach.id}`}
						className="text-[14px] font-semibold text-brand underline-offset-4 hover:underline"
					>
						{coach.title}
					</Link>
				) : (
					<span className="text-[14px] font-semibold text-ink-3">Coach TBA</span>
				)}
				<p className="mt-0.5 text-[12px] text-ink-4">Lead coach</p>
			</div>
		</li>
	);
}
