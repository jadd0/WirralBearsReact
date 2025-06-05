import AllImagesView from '@/components/image/AllImagesView';
import { LogoBanner } from '@/components/layout/LogoBanner';

export default function AllImagesViewPage() {
	return (
		<div className="min-h-screen font-sans flex flex-col">
			<LogoBanner />
			<AllImagesView popUpActivated={true} deleteImage={false} />
		</div>
	);
}
