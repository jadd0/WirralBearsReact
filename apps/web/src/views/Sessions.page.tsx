'use client';

import { useGetFullSchedule } from '@hooks/session.hooks';
import SessionGrid from '@components/sessions/display/SessionGrid';
import SessionGridSkeleton from '@components/sessions/display/SessionGridSkeleton';
import { PageHeader } from '@components/layout/PageHeader';
import { FullSessionSchedule } from '@/db/schema';

const JOIN_FORM_URL =
	'https://docs.google.com/forms/d/1xyuIacKZlv96QKh8mAARyrk7MR2WHATB1tTouBxo0CU/viewform?edit_requested=true';

export default function SessionsPage() {
	const { data: schedule, isLoading, isError } = useGetFullSchedule();
	const scheduleTyped = schedule as FullSessionSchedule | undefined;

	// The schedule can come back empty, so this must not assume a first day.
	const updatedAt = scheduleTyped?.sessionDays?.[0]?.updatedAt;
	const hasSchedule = Boolean(scheduleTyped?.sessionDays?.length);

	return (
		<>
			<PageHeader
				eyebrow="Sessions"
				title="Weekly training schedule"
				lead="Turn up to the session for your age group. The first taster session is free, and there is nothing to arrange in advance."
			>
				<div className="mt-8 flex flex-wrap items-center gap-3">
					<a
						href={JOIN_FORM_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-xl bg-brand px-6 py-3.5 font-semibold text-white shadow-[var(--shadow-brand)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-strong active:translate-y-0 active:scale-[0.98]"
					>
						Join a session
					</a>
					{updatedAt && (
						<span className="text-[15px] text-ink-4">
							Updated {new Date(updatedAt).toLocaleDateString('en-GB')}
						</span>
					)}
				</div>
			</PageHeader>

			<section className="section">
				<div className="container-page">
					{isLoading && <SessionGridSkeleton />}

					{!isLoading && isError && (
						<EmptyNotice
							title="We couldn't load the schedule"
							body="Please try again shortly, or contact a coach for this week's times."
						/>
					)}

					{!isLoading && !isError && hasSchedule && (
						<SessionGrid schedule={scheduleTyped as FullSessionSchedule} />
					)}

					{!isLoading && !isError && !hasSchedule && (
						<EmptyNotice
							title="No sessions listed yet"
							body="The timetable is being updated. Email the club and we will tell you which session suits your age group."
						/>
					)}

					<div className="mt-12 rounded-2xl border border-line bg-paper-2 p-6 text-[15px] leading-relaxed text-ink-3">
						<p>
							The schedule can change with weather and coach availability.
							Contact a coach for any special requirements.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

function EmptyNotice({ title, body }: { title: string; body: string }) {
	return (
		<div className="rounded-3xl border border-dashed border-line-strong bg-paper-2/60 px-8 py-16 text-center">
			<h2 className="font-display text-xl font-extrabold text-ink">{title}</h2>
			<p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-3">
				{body}
			</p>
			<a
				href="mailto:wirralbears@gmail.com"
				className="mt-7 inline-flex rounded-xl border border-line-strong bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-paper"
			>
				Email the club
			</a>
		</div>
	);
}
