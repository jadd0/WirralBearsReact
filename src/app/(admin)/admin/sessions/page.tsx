import type { Metadata } from 'next';
import EditSessionsPage from '@views/admin/Sessions.page';

export const metadata: Metadata = {
	title: 'Edit sessions',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <EditSessionsPage />;
}
