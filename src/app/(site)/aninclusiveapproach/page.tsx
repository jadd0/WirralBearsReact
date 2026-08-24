import type { Metadata } from 'next';
import AnInclusiveApproachPage from '@views/AnInclusiveApproach.page';

export const metadata: Metadata = {
	title: 'An inclusive approach',
	description: 'How Wirral Bears makes basketball open to every player, whatever their background or ability.',
};

export default function Page() {
	return <AnInclusiveApproachPage />;
}
