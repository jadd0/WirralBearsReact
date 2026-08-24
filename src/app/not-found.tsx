import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@components/layout/SiteHeader';
import { Footer } from '@components/layout/Footer';

export const metadata: Metadata = {
	title: 'Page not found',
};

export default function NotFound() {
	return (
		<>
			<SiteHeader />
			<main
				id="main"
				className="container-page flex w-full flex-1 flex-col items-center py-28 md:py-36"
			>
				<p className="eyebrow">404</p>
				<h1 className="mt-4 text-center text-4xl font-extrabold tracking-tight text-ink md:text-6xl">
					We couldn&rsquo;t find that page
				</h1>
				<p className="mt-5 max-w-md text-center text-lg text-ink-3">
					The page may have moved, or the link that brought you here may be out
					of date.
				</p>
				<div className="mt-10 flex flex-wrap justify-center gap-3">
					<Link
						href="/"
						className="rounded-xl bg-brand px-6 py-3.5 font-semibold text-white shadow-[var(--shadow-brand)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-strong active:translate-y-0 active:scale-[0.98]"
					>
						Back to home
					</Link>
					<Link
						href="/sessions"
						className="rounded-xl border border-line-strong px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-ink/5"
					>
						See training sessions
					</Link>
				</div>
			</main>
			<Footer />
		</>
	);
}
