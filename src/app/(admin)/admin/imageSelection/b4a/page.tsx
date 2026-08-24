import type { Metadata } from 'next';
import B4AImageSelectionPage from '@views/admin/imageSelection/B4AImageSelection.page';

export const metadata: Metadata = {
	title: 'Ball 4 All carousel',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <B4AImageSelectionPage />;
}
