'use client';

import { SessionDay, SessionWithCoach } from '@/db/schema';
import { CoachPreview } from '@/server/types/coach.types';
import SessionItem from './SessionItem';

export default function SessionDayComponent({
	sessionDay,
	coaches,
}: {
	sessionDay: SessionDay & { sessions: SessionWithCoach[] };
	coaches?: CoachPreview[] | null;
}) {
	const isEmpty = sessionDay.sessions.length === 0;

	// A day with nothing on collapses to a single quiet line so the week still
	// reads in order without taking up a full card.
	if (isEmpty) {
		return (
			<div className="flex items-baseline gap-4 rounded-xl border border-line/70 px-5 py-3.5">
				<h2 className="font-display text-[15px] font-bold text-ink-4">
					{sessionDay.day}
				</h2>
				<span className="text-[14px] text-ink-4">No sessions</span>
			</div>
		);
	}

	return (
		<section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-sm)]">
			<h2 className="flex items-baseline gap-3 border-b border-line bg-paper-2/50 px-5 py-4 font-display text-lg font-extrabold tracking-[-0.02em] text-ink">
				{sessionDay.day}
				<span className="text-[13px] font-semibold text-ink-4 tabular">
					{sessionDay.sessions.length} session
					{sessionDay.sessions.length === 1 ? '' : 's'}
				</span>
			</h2>

			<ul className="grid sm:grid-cols-2 lg:grid-cols-3">
				{sessionDay.sessions.map((session) => (
					<SessionItem
						key={session.id}
						session={session}
						coach={coaches?.find((c) => c.id === session.leadCoach)}
					/>
				))}
			</ul>
		</section>
	);
}
