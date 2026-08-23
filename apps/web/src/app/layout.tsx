import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const quicksand = Quicksand({
	subsets: ['latin'],
	variable: '--font-quicksand',
	display: 'swap',
});

export const metadata: Metadata = {
	metadataBase: new URL('https://wirralbears.com'),
	title: {
		default: 'Wirral Bears Basketball Club',
		template: '%s | Wirral Bears',
	},
	description:
		'A basketball club in Woodchurch, Wirral, running sessions for all ages and abilities.',
	icons: {
		icon: [
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
		],
		apple: '/apple-touch-icon.png',
	},
	openGraph: {
		type: 'website',
		siteName: 'Wirral Bears Basketball Club',
		title: 'Wirral Bears Basketball Club',
		description:
			'A basketball club in Woodchurch, Wirral, running sessions for all ages and abilities.',
		images: ['/images/WirralBearsBanner.png'],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={quicksand.variable}>
			<body className="flex min-h-screen w-full flex-col font-sans tracking-wide">
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:shadow-lg"
				>
					Skip to content
				</a>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
