import type { Metadata } from 'next';
import ImageSelectionPage from '@views/admin/imageSelection/ImageSelection.page';

export const metadata: Metadata = {
	title: 'Image selection',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <ImageSelectionPage />;
}
