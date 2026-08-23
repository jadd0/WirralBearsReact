import { Navbar } from '@components/layout/Navbar';
import { LogoBanner } from '@components/layout/LogoBanner';
import { Footer } from '@components/layout/Footer';

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<LogoBanner />
			<main id="main" className="box-border flex w-full flex-1 flex-col items-center">
				{children}
			</main>
			<Footer />
		</>
	);
}
