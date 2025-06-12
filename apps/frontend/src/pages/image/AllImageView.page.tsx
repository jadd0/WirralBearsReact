import AllImagesView from '@/components/image/AllImagesView';
import { LogoBanner } from '@/components/layout/LogoBanner';
import { Footer } from '@/components/layout/Footer';

export default function AllImagesViewPage() {
	return (
		<div className="min-h-screen min-w-full font-sans flex flex-col">
			<LogoBanner />
			<AllImagesView popUpActivated={true} deleteImage={false} />
			<Footer />
		</div>
	);
}
