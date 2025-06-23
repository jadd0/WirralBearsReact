import CarouselImageSelector from '@/components/imageSelection/CarouselImageSelector';
import {
	useGetAllFirstCarouselImages,
	useReplaceAllFirstCarouselImages,
} from '@/hooks/image.hooks';

export default function FirstImageSelectionPage() {
	return (
		<CarouselImageSelector
			title="Image Selection for First Carousel"
			description="Click on an image to change it"
			showKeyLabels={false}
			imageCount={4}
			gridCols={2}
			useGetAllImages={useGetAllFirstCarouselImages}
			useReplaceAllImages={useReplaceAllFirstCarouselImages}
		/>
	);
}
