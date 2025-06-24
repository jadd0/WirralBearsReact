import { CarouselComponent } from '@components/layout/Carousel';
import { useGetAllB4ACarouselImages } from '@/hooks/image.hooks';

interface CarouselImage {
	id?: string;
	imageId: string;
	key: string;
	createdAt?: Date;
	updatedAt?: Date;
	imageUrl?: string;
}

export function BallForAllGrid() {
	const { data: carouselImages = [], isLoading } = useGetAllB4ACarouselImages();

	const titles = [
		'Joy',
		'Positivity',
		'Respect',
		'Equal Focus & Equal Minutes',
		'Dedication & Effort',
		'Growth',
		'Pass',
		'Defence',
		'Shoot',
		'Play',
	];

	// Type assertion to tell TypeScript the correct type
	const typedCarouselImages = carouselImages as CarouselImage[];

	// Extract headings from the key property of each image
	const headings = typedCarouselImages.map((image) => titles[parseInt(image.key)]);
	console.log({ headings });

	return (
		<div className="w-full max-w-lg mx-auto my-8">
			<CarouselComponent
				images={typedCarouselImages}
				headings={headings}
				isLoading={isLoading}
			/>
		</div>
	);
}
