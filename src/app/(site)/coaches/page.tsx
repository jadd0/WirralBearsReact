import type { Metadata } from 'next';
import ViewCoachesPage from '@views/coach/ViewCoaches.page';

export const metadata: Metadata = {
	title: 'Coaches',
	description: 'Meet the coaching team behind Wirral Bears.',
};

export default function Page() {
	return <ViewCoachesPage />;
}
