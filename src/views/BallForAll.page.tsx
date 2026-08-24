'use client';

import Link from 'next/link';
import { PageHeader } from '@components/layout/PageHeader';
import { BallForAllGrid } from '@components/layout/BallForAllGrid';

const JOIN_FORM_URL =
	'https://docs.google.com/forms/d/1xyuIacKZlv96QKh8mAARyrk7MR2WHATB1tTouBxo0CU/viewform?edit_requested=true';

const steps = [
	{
		title: 'Discuss them',
		desc: 'Talk the principles through with your coaches and team-mates so everyone starts from the same place.',
	},
	{
		title: 'Sign and commit',
		desc: 'Every player and every coach signs up to the same ten principles. Nobody is exempt.',
	},
	{
		title: 'Play by them',
		desc: 'Every session, every game. They only work if they hold when the game gets tight.',
	},
];

export default function BallForAllPage() {
	return (
		<>
			<PageHeader
				eyebrow="Ball 4 All"
				title="Our commitment"
				lead="To join the club, every player and coach commits to the Ball 4 All principles. They are what makes the basketball here good, and enjoyable, for everyone."
			/>

			<section className="section">
				<div className="container-page">
					<div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
						<div>
							<h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
								How you join
							</h2>
							<ol className="mt-8 space-y-7">
								{steps.map((step, index) => (
									<li key={step.title} className="flex gap-5">
										<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-white tabular">
											{index + 1}
										</span>
										<div>
											<h3 className="font-display text-lg font-extrabold text-ink">
												{step.title}
											</h3>
											<p className="mt-1.5 text-[16px] leading-relaxed text-ink-3">
												{step.desc}
											</p>
										</div>
									</li>
								))}
							</ol>
						</div>

						<aside className="self-start rounded-3xl bg-ink p-8 text-white md:p-10">
							<p className="text-[12px] font-semibold tracking-[0.18em] text-brand uppercase">
								Our promise
							</p>
							<p className="mt-5 font-display text-2xl leading-snug font-extrabold tracking-[-0.02em] md:text-[28px]">
								No player will ever be asked to leave the club, unless they do
								not follow these principles.
							</p>
							<a
								href={JOIN_FORM_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-8 inline-flex rounded-xl bg-brand px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-brand-strong active:translate-y-0 active:scale-[0.98]"
							>
								Join a session
							</a>
						</aside>
					</div>
				</div>
			</section>

			<section className="border-t border-line bg-paper-2 py-20 md:py-24">
				<div className="container-page">
					<div className="max-w-2xl">
						<p className="eyebrow">The principles</p>
						<h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
							All ten, in full
						</h2>
					</div>
					<div className="mt-12">
						<BallForAllGrid />
					</div>
					<p className="mt-14 border-l-2 border-brand pl-6 font-display text-xl leading-snug font-bold tracking-[-0.02em] text-ink md:text-2xl">
						Because it&rsquo;s ball for all, not just some.
					</p>
					<Link
						href="/sessions"
						className="mt-8 inline-flex text-[15px] font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-strong hover:underline"
					>
						Find a session for your age group
					</Link>
				</div>
			</section>
		</>
	);
}
