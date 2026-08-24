import type { Metadata } from 'next';
import ImageDashboardPage from '@views/admin/image/ImageDashboard.page';

export const metadata: Metadata = {
	title: 'Images',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <ImageDashboardPage />;
}
