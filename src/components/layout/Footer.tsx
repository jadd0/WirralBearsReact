import Image from 'next/image';
import Link from 'next/link';

const contacts = [
	{ label: 'Club', value: 'wirralbears@gmail.com', href: 'mailto:wirralbears@gmail.com' },
	{
		label: 'Photography, Giannis',
		value: 'icona.photo.service@gmail.com',
		href: 'mailto:icona.photo.service@gmail.com',
	},
	{
		label: 'Website, Jadd',
		value: 'www.jadd.live',
		href: 'https://jadd.live',
	},
];

const clubLinks = [
	{ href: '/sessions', label: 'Sessions' },
	{ href: '/games', label: 'Games' },
	{ href: '/coaches', label: 'Coaches' },
	{ href: '/image/viewall', label: 'Gallery' },
	{ href: '/blog/blogs', label: 'Blog' },
];

const aboutLinks = [
	{ href: '/ballforall', label: 'Ball 4 All' },
	{ href: '/assurances', label: 'Assurance' },
	{ href: '/aninclusiveapproach', label: 'An inclusive approach' },
	{ href: '/sponsorship', label: 'Sponsorship' },
];

const elsewhere = [
	{ href: 'https://goo.gl/maps/2dHvRTcbWPFoZLoT6', label: 'Woodchurch venue' },
	{ href: 'https://instagram.com/wirralbears2024?r=nametag', label: 'Instagram' },
	{ href: 'https://facebook.com/WirralBears/', label: 'Facebook' },
];

const sponsors = [
	{
		href: 'https://taylorbrownsolicitors.com',
		src: '/images/taylor Brown 1.png',
		alt: 'Taylor Brown Solicitors',
	},
	{
		href: 'https://www.chesterfinancial.co.uk',
		src: '/images/Chester Financial.png',
		alt: 'Chester Financial Wealth Management',
	},
];

export function Footer() {
	return (
		<footer className="relative mt-auto overflow-hidden bg-ink text-white">
			<div className="grain absolute inset-0 opacity-20" aria-hidden="true" />

			<div className="container-page relative py-16 md:py-20">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					<div>
						<div className="flex items-center gap-3">
							<Image
								src="/images/bears big red.png"
								alt=""
								width={56}
								height={56}
								className="h-12 w-12 object-contain"
							/>
							<span className="font-display text-xl leading-none font-extrabold tracking-[-0.02em]">
								WIRRAL BEARS
							</span>
						</div>
						<p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/55">
							A basketball club in Woodchurch, Wirral. Sessions for every age
							and ability, on and off the court.
						</p>
						<ul className="mt-6 space-y-3">
							{contacts.map((contact) => (
								<li key={contact.href}>
									<span className="block text-[11px] font-semibold tracking-[0.16em] text-white/35 uppercase">
										{contact.label}
									</span>
									<a
										href={contact.href}
										className="text-[15px] text-white/80 transition-colors hover:text-brand"
									>
										{contact.value}
									</a>
								</li>
							))}
						</ul>
					</div>

					<FooterColumn title="Club">
						{clubLinks.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="text-[15px] text-white/60 transition-colors hover:text-white"
								>
									{link.label}
								</Link>
							</li>
						))}
					</FooterColumn>

					<FooterColumn title="About">
						{aboutLinks.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="text-[15px] text-white/60 transition-colors hover:text-white"
								>
									{link.label}
								</Link>
							</li>
						))}
					</FooterColumn>

					<FooterColumn title="Elsewhere">
						{elsewhere.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[15px] text-white/60 transition-colors hover:text-white"
								>
									{link.label}
								</a>
							</li>
						))}
					</FooterColumn>
				</div>
			</div>

			<div className="relative border-t border-white/10">
				<div className="container-page flex flex-col items-center gap-6 py-8 sm:flex-row sm:justify-between">
					<span className="text-[11px] font-semibold tracking-[0.16em] text-white/35 uppercase">
						Supported by
					</span>
					<div className="flex flex-wrap items-center justify-center gap-4">
						{sponsors.map((sponsor) => (
							<a
								key={sponsor.href}
								href={sponsor.href}
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-16 w-40 items-center justify-center rounded-xl bg-surface/95 p-3 transition-transform duration-200 hover:-translate-y-0.5"
							>
								<Image
									src={sponsor.src}
									alt={sponsor.alt}
									width={160}
									height={64}
									className="h-full w-full object-contain"
								/>
							</a>
						))}
					</div>
				</div>
			</div>

			<div className="relative border-t border-white/10">
				<div className="container-page py-6 text-center text-[13px] text-white/35">
					&copy; {new Date().getFullYear()} Wirral Bears Basketball Club
				</div>
			</div>
		</footer>
	);
}

function FooterColumn({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<h2 className="text-[11px] font-semibold tracking-[0.16em] text-white/35 uppercase">
				{title}
			</h2>
			<ul className="mt-5 space-y-3">{children}</ul>
		</div>
	);
}
