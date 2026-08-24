import type { Metadata } from 'next';
import SessionsPage from '@views/Sessions.page';

export const metadata: Metadata = {
	title: 'Sessions',
	description: 'Weekly training sessions for every age group, with times and venues.',
};

export default function Page() {
	return <SessionsPage />;
}
