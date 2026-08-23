import type { Metadata } from 'next';
import FirstImageSelectionPage from '@views/admin/imageSelection/FirstImageSelection.page';

export const metadata: Metadata = {
	title: 'First carousel',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <FirstImageSelectionPage />;
}
