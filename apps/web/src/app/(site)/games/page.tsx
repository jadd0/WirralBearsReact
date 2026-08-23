import type { Metadata } from 'next';
import GamesDisplayPage from '@views/Games.page';

export const metadata: Metadata = {
	title: 'Games',
	description: 'Fixtures, results and season records for Wirral Bears teams.',
};

export default function Page() {
	return <GamesDisplayPage />;
}
