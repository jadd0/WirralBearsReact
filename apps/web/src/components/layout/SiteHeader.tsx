'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const JOIN_FORM_URL =
	'https://docs.google.com/forms/d/1xyuIacKZlv96QKh8mAARyrk7MR2WHATB1tTouBxo0CU/viewform?edit_requested=true';

const SHOP_URL = 'https://sixthmanbasketball.co.uk/wirral-bears';

/** The club's values pages: read once, not visited weekly. */
const aboutLinks = [
	{ href: '/ballforall', label: 'Ball 4 All' },
	{ href: '/assurances', label: 'Assurance' },
	{ href: '/aninclusiveapproach', label: 'An inclusive approach' },
];

/** What people actually come back for. */
const primaryLinks = [
	{ href: '/sessions', label: 'Sessions' },
	{ href: '/games', label: 'Games' },
	{ href: '/coaches', label: 'Coaches' },
	{ href: '/image/viewall', label: 'Gallery' },
	{ href: '/blog/blogs', label: 'Blog' },
	{ href: '/sponsorship', label: 'Sponsorship' },
];

const allLinks = [...primaryLinks, ...aboutLinks];

function isCurrent(pathname: string, href: string) {
	return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function SiteHeader() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => setOpen(false), [pathname]);

	// The overlay covers the page, so stop the page behind it from scrolling.
	useEffect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		// Heights here are mirrored by --header-h in globals.css (69px / 113px at
		// md+). Change one and change the other, or the hero stops fitting.
		<header className="sticky top-0 z-50">
			{/* Utility strip */}
			<div className="hidden bg-ink text-white md:block">
				<div className="container-page flex h-9 items-center justify-end gap-7 text-[13px]">
					{aboutLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
							className={`transition-colors hover:text-white ${
								isCurrent(pathname, link.href)
									? 'text-white'
									: 'text-white/60'
							}`}
						>
							{link.label}
						</Link>
					))}
					<a
						href={SHOP_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="text-white/60 transition-colors hover:text-white"
					>
						Shop
					</a>
				</div>
			</div>

			{/* Main bar */}
			<div className="border-b border-line bg-paper/85 backdrop-blur-md">
				<div className="container-page flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
					<Link
						href="/"
						className="flex shrink-0 items-center gap-3"
						aria-label="Wirral Bears, home"
					>
						<Image
							src="/images/bears big red.png"
							alt=""
							width={48}
							height={48}
							priority
							className="h-10 w-10 object-contain md:h-11 md:w-11"
						/>
						<span className="font-display text-[19px] leading-none font-extrabold tracking-[-0.02em] text-ink md:text-[21px]">
							WIRRAL BEARS
						</span>
					</Link>

					<nav aria-label="Primary" className="hidden lg:block">
						<ul className="flex items-center gap-1">
							{primaryLinks.map((link) => {
								const current = isCurrent(pathname, link.href);
								return (
									<li key={link.href}>
										<Link
											href={link.href}
											aria-current={current ? 'page' : undefined}
											className={`relative rounded-lg px-3 py-2 text-[15px] font-medium transition-colors ${
												current
													? 'text-brand'
													: 'text-ink-3 hover:text-ink'
											}`}
										>
											{link.label}
											{current && (
												<span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand" />
											)}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>

					<div className="flex items-center gap-2">
						<a
							href={JOIN_FORM_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="hidden rounded-xl bg-brand px-5 py-2.5 text-[15px] font-semibold text-white shadow-[var(--shadow-brand)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-strong active:translate-y-0 active:scale-[0.98] sm:inline-flex"
						>
							Join a session
						</a>

						<button
							type="button"
							onClick={() => setOpen((o) => !o)}
							aria-expanded={open}
							aria-controls="mobile-menu"
							aria-label={open ? 'Close menu' : 'Open menu'}
							className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl transition-colors hover:bg-ink/5 lg:hidden"
						>
							<span
								className={`h-0.5 w-6 rounded-full bg-ink transition-transform duration-300 ${
									open ? 'translate-y-[7px] rotate-45' : ''
								}`}
							/>
							<span
								className={`h-0.5 w-6 rounded-full bg-ink transition-opacity duration-200 ${
									open ? 'opacity-0' : ''
								}`}
							/>
							<span
								className={`h-0.5 w-6 rounded-full bg-ink transition-transform duration-300 ${
									open ? '-translate-y-[7px] -rotate-45' : ''
								}`}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile overlay */}
			<div
				id="mobile-menu"
				hidden={!open}
				className="fixed inset-x-0 bottom-0 top-[68px] overflow-y-auto border-t border-line bg-paper lg:hidden"
			>
				<nav aria-label="Mobile" className="container-page py-8">
					<ul className="flex flex-col gap-1">
						{allLinks.map((link, index) => {
							const current = isCurrent(pathname, link.href);
							return (
								<li
									key={link.href}
									style={{
										animation: open
											? `slideInUp 0.4s ease-out ${index * 0.04}s both`
											: undefined,
									}}
								>
									<Link
										href={link.href}
										aria-current={current ? 'page' : undefined}
										className={`flex items-center justify-between rounded-xl px-4 py-4 text-lg font-semibold transition-colors ${
											current
												? 'bg-brand text-white'
												: 'text-ink hover:bg-ink/5'
										}`}
									>
										{link.label}
									</Link>
								</li>
							);
						})}
						<li
							style={{
								animation: open
									? `slideInUp 0.4s ease-out ${allLinks.length * 0.04}s both`
									: undefined,
							}}
						>
							<a
								href={SHOP_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-between rounded-xl px-4 py-4 text-lg font-semibold text-ink transition-colors hover:bg-ink/5"
							>
								Shop
								<span aria-hidden="true" className="text-ink-4">
									&#8599;
								</span>
							</a>
						</li>
					</ul>

					<a
						href={JOIN_FORM_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-6 flex items-center justify-center rounded-xl bg-brand px-6 py-4 text-lg font-semibold text-white"
					>
						Join a session
					</a>
				</nav>
			</div>
		</header>
	);
}
