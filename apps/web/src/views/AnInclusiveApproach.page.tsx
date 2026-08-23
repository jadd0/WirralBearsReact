'use client';

import Image from 'next/image';
import { InfoBox } from '@components/layout/InfoBox';
import { PageHeader } from '@components/layout/PageHeader';

const styles = [
	{
		title: 'Competitive & disciplined',
		desc: 'Enjoy challenging training and matches? We run structured sessions and competitive play.',
	},
	{
		title: 'Relaxed & fun',
		desc: 'Prefer a gentler pace? There is a welcoming space to enjoy basketball on your own terms.',
	},
];

const commitments = [
	'High quality, certified coaching for all',
	'Participation at every ability level, including matches',
	'Consistent, focused coaching for each group',
];

const pillars = [
	{
		title: 'Inclusive coaching',
		desc: 'Experienced, teacher-led coaches. No favouritism and no over-focus on star players. We build from the bottom up and keep games fair.',
	},
	{
		title: 'Transparent funding',
		desc: '100% of funds go to the junior programme. Sponsorships are welcome, and all finances are open.',
	},
	{
		title: 'Support for all',
		desc: 'Players needing extra help can contribute to the club in lieu of fees or kit through the associate programme.',
	},
];

function CheckIcon() {
	return (
		<svg
			aria-hidden="true"
			className="mt-0.5 h-5 w-5 shrink-0 text-brand"
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			viewBox="0 0 24 24"
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
		</svg>
	);
}

export default function AnInclusiveApproachPage() {
	return (
		<>
			<PageHeader
				eyebrow="An inclusive approach"
				title="We tailor our approach to every young player"
				lead="Every player's journey is different. Whether you love competitive drills or relaxed games, there is a place for you."
			/>

			<section className="section">
				<div className="container-page">
					<div className="grid gap-4 sm:grid-cols-2">
						{styles.map((style) => (
							<div
								key={style.title}
								className="rounded-2xl border border-line bg-surface p-7 transition-shadow duration-300 hover:shadow-[var(--shadow-card)]"
							>
								<span className="block h-1 w-10 rounded-full bg-brand" />
								<h2 className="mt-5 font-display text-xl font-extrabold tracking-[-0.02em] text-ink">
									{style.title}
								</h2>
								<p className="mt-3 text-[17px] leading-relaxed text-ink-3">
									{style.desc}
								</p>
							</div>
						))}
					</div>

					<p className="mt-8 border-l-2 border-brand pl-6 font-display text-xl leading-snug font-bold tracking-[-0.02em] text-ink md:text-2xl">
						Both are equal to us. We help every player find their place, and
						bridge the gap between the two.
					</p>
				</div>
			</section>

			<section className="border-y border-line bg-paper-2 py-20 md:py-24">
				<div className="container-page grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
					<div className="overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
						<Image
							src="/images/AZ4A5789.jpg"
							alt="Wirral Bears players during a session"
							width={1200}
							height={800}
							sizes="(min-width: 1024px) 34rem, 92vw"
							className="h-full w-full object-cover"
						/>
					</div>
					<InfoBox title="Funding & assurance model">
						<ul className="space-y-4">
							{commitments.map((item) => (
								<li key={item} className="flex gap-3">
									<CheckIcon />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</InfoBox>
				</div>
			</section>

			<section className="section">
				<div className="container-page">
					<h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
						How the club is run
					</h2>
					<div className="mt-10 grid gap-4 md:grid-cols-3">
						{pillars.map((pillar) => (
							<div
								key={pillar.title}
								className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7"
							>
								<h3 className="font-display text-lg font-extrabold tracking-[-0.02em] text-brand">
									{pillar.title}
								</h3>
								<p className="mt-3 text-[15px] leading-relaxed text-ink-3">
									{pillar.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
