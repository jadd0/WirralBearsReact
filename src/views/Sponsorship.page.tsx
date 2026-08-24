'use client';

import Image from 'next/image';
import { InfoBox } from '@components/layout/InfoBox';
import { PageHeader } from '@components/layout/PageHeader';

const sponsors = [
	{
		name: 'Taylor Brown Solicitors',
		href: 'https://taylorbrownsolicitors.com',
		src: '/images/taylor Brown 1.png',
	},
	{
		name: 'Chester Financial Wealth Management Ltd.',
		href: 'https://www.chesterfinancial.co.uk',
		src: '/images/Chester Financial.png',
	},
];

export default function SponsorshipPage() {
	return (
		<>
			<PageHeader
				eyebrow="Sponsorship"
				title="Our sponsors"
				lead="A special thank you to Taylor Brown Solicitors and Chester Financial Wealth Management Ltd. for sponsoring the club. Without them we would be nowhere near where we are today."
			/>

			<section className="section">
				<div className="container-page">
					<div className="grid gap-4 sm:grid-cols-2">
						{sponsors.map((sponsor) => (
							<a
								key={sponsor.href}
								href={sponsor.href}
								target="_blank"
								rel="noopener noreferrer"
								className="group flex flex-col items-center rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
							>
								<div className="flex h-24 w-full items-center justify-center">
									<Image
										src={sponsor.src}
										alt={sponsor.name}
										width={220}
										height={96}
										className="h-full w-auto max-w-full object-contain"
									/>
								</div>
								<span className="mt-6 text-center font-display font-bold text-ink transition-colors group-hover:text-brand">
									{sponsor.name}
								</span>
							</a>
						))}
					</div>

					<div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
						<InfoBox title="Donate">
							<p>
								Wirral Bears Basketball Club is a non-profit organisation, and
								money is what allows us to carry on. Every pound donated goes
								towards the club, buying balls, kits and more. Thank you for
								your support.
							</p>
							<form
								action="https://www.paypal.com/donate"
								method="post"
								target="_top"
								className="mt-7"
							>
								<input
									type="hidden"
									name="hosted_button_id"
									value="X7RBJZ2S884D8"
								/>
								<button
									type="submit"
									className="rounded-xl bg-brand px-7 py-3.5 font-semibold text-white shadow-[var(--shadow-brand)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-strong active:translate-y-0 active:scale-[0.98]"
								>
									Donate with PayPal
								</button>
							</form>
						</InfoBox>

						<aside className="self-start rounded-3xl bg-ink p-8 text-white md:p-10">
							<p className="text-[12px] font-semibold tracking-[0.18em] text-brand uppercase">
								Sponsor the club
							</p>
							<h2 className="mt-5 font-display text-2xl leading-snug font-extrabold tracking-[-0.02em]">
								Put your name alongside a growing junior programme
							</h2>
							<p className="mt-5 leading-relaxed text-white/65">
								Every pound raised goes into the junior programme, and the
								finances are open to anyone who asks. If your business would
								like to support the club, we would be glad to hear from you.
							</p>
							<a
								href="mailto:wirralbears@gmail.com"
								className="mt-8 inline-flex rounded-xl border border-white/25 px-6 py-3.5 font-semibold transition-colors hover:bg-white/10"
							>
								Email the club
							</a>
						</aside>
					</div>
				</div>
			</section>
		</>
	);
}
