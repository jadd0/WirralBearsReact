'use client';

import Image from 'next/image';
import { InfoBox } from '@components/layout/InfoBox';
import { PageHeader } from '@components/layout/PageHeader';

const safeguardingTips = [
	"If you notice sudden changes in your child's behaviour or have concerns, speak to a coach or our safeguarding officer, Simon Barker.",
	'Do not allow your child to share personal details with adults, and vice versa.',
	'If giving or receiving lifts, ensure everyone feels safe and report any concerns to a coach or Simon Barker.',
	'Ensure your child is safe getting to and from sessions and is collected on time.',
];

const policies = [
	'Transporting children',
	'Anti-bullying',
	'Supervision ratios',
	'Safeguarding',
	'Social media',
	'Photography',
	'Equality',
	'Conduct',
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

export default function AssurancesPage() {
	return (
		<>
			<PageHeader
				eyebrow="Assurance"
				title="Fully aligned with Basketball England"
				lead="We follow Basketball England's guidance for safe operation. Our full policies are available on request."
			/>

			<section className="section">
				<div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
					<div>
						<InfoBox title="Safeguarding tips">
							<ul className="space-y-4">
								{safeguardingTips.map((tip) => (
									<li key={tip} className="flex gap-3">
										<CheckIcon />
										<span>{tip}</span>
									</li>
								))}
							</ul>
						</InfoBox>

						<InfoBox title="Social media use" className="mt-6">
							<p>
								Please encourage your child to use social media responsibly. If
								there are any issues, let us know. Young adults may say things
								online they would not say in person, and real-life respect comes
								first.
							</p>
						</InfoBox>
					</div>

					<div className="lg:pt-2">
						<div className="overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
							<Image
								src="/images/AZ4A5625.jpg"
								alt="A Wirral Bears coach leading a training session"
								width={1200}
								height={800}
								sizes="(min-width: 1024px) 32rem, 92vw"
								className="h-full w-full object-cover"
							/>
						</div>

						<h2 className="mt-10 font-display text-xl font-extrabold tracking-[-0.02em] text-ink">
							Policies we hold
						</h2>
						<ul className="mt-5 flex flex-wrap gap-2">
							{policies.map((policy) => (
								<li
									key={policy}
									className="rounded-lg border border-line bg-surface px-3.5 py-2 text-[15px] font-medium text-ink-3"
								>
									{policy}
								</li>
							))}
						</ul>
						<p className="mt-6 text-[15px] leading-relaxed text-ink-4">
							Copies of any policy are available on request. Speak to a coach or
							email the club.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}
