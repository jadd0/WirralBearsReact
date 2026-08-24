import type { Metadata } from 'next';
import MultipleImageUploadPage from '@views/admin/image/ImagesUpload.page';

export const metadata: Metadata = {
	title: 'Upload images',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <MultipleImageUploadPage />;
}
