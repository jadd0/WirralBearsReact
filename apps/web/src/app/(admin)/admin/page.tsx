import type { Metadata } from 'next';
import AdminPage from '@views/admin/Admin.page';

export const metadata: Metadata = {
	title: 'Dashboard',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <AdminPage />;
}
