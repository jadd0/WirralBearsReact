import type { Metadata } from 'next';
import SponsorshipPage from '@views/Sponsorship.page';

export const metadata: Metadata = {
	title: 'Sponsorship',
	description: 'Support Wirral Bears and reach a growing community club on the Wirral.',
};

export default function Page() {
	return <SponsorshipPage />;
}
