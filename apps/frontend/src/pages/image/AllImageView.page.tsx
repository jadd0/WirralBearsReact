import AllImagesView from '@/components/image/AllImagesView';
import { LogoBanner } from '@/components/layout/LogoBanner';
import { Footer } from '@/components/layout/Footer';

export default function AllImagesViewPage() {
	return (
		<div className="min-h-screen min-w-full font-sans flex flex-col">
			<LogoBanner />
			<h1 className="text-3xl font-bold mb-4 text-center">Image Gallery</h1>
			<p className="text-lg text-gray-600 text-center">
				View a collection of images taken at games, training etc.
			</p>
			<AllImagesView popUpActivated={true} deleteImage={false} />
			<Footer />
		</div>
	);
}
