import { SiteHeader } from '@components/layout/SiteHeader';
import { Footer } from '@components/layout/Footer';

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<SiteHeader />
			<main id="main" className="flex w-full flex-1 flex-col">
				{children}
			</main>
			<Footer />
		</>
	);
}
