import type { Metadata } from 'next';
import BallForAllPage from '@views/BallForAll.page';

export const metadata: Metadata = {
	title: 'Ball 4 All',
	description: 'The ten principles every Wirral Bears player and coach commits to.',
};

export default function Page() {
	return <BallForAllPage />;
}
