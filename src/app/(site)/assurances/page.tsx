import type { Metadata } from 'next';
import AssurancesPage from '@views/Assurances.page';

export const metadata: Metadata = {
	title: 'Assurances',
	description: 'Our safeguarding, conduct and welfare commitments to players and parents.',
};

export default function Page() {
	return <AssurancesPage />;
}
