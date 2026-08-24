import type { Metadata } from 'next';
import AllImagesViewPage from '@views/image/AllImageView.page';

export const metadata: Metadata = {
	title: 'Gallery',
	description: 'Photographs from Wirral Bears training sessions, games and club events.',
};

export default function Page() {
	return <AllImagesViewPage />;
}
