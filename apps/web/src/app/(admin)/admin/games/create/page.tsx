import type { Metadata } from 'next';
import GamesEditCreatePage from '@views/admin/games/GamesCreate.page';

export const metadata: Metadata = {
	title: 'Create game',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <GamesEditCreatePage />;
}
