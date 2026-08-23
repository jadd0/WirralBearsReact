import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@components/layout/Navbar';
import { LogoBanner } from '@components/layout/LogoBanner';
import { Footer } from '@components/layout/Footer';

export const metadata: Metadata = {
	title: 'Page not found',
};

export default function NotFound() {
	return (
		<>
			<Navbar />
			<LogoBanner />
			<main id="main" className="flex w-full flex-1 flex-col items-center px-6 py-24">
				<p className="text-sm font-semibold tracking-[0.2em] text-red-600 uppercase">
					404
				</p>
				<h1 className="mt-4 text-center text-4xl font-bold tracking-tight">
					We couldn&rsquo;t find that page
				</h1>
				<p className="mt-4 max-w-md text-center text-gray-600">
					The page may have moved, or the link that brought you here may be out
					of date.
				</p>
				<div className="mt-10 flex flex-wrap justify-center gap-3">
					<Link
						href="/"
						className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
					>
						Back to home
					</Link>
					<Link
						href="/sessions"
						className="rounded-lg border border-black/20 px-6 py-3 font-semibold transition-colors hover:bg-black/5"
					>
						See training sessions
					</Link>
				</div>
			</main>
			<Footer />
		</>
	);
}
