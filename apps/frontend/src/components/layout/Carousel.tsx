import { useEffect, useState } from 'react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel';
import { Skeleton } from '../ui/skeleton';
import { Image } from '@wirralbears/packages/types';

export function CarouselComponent({ images }: { images: Image[] }) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>(
		{}
	);

	// Preload images and track loading status
	useEffect(() => {
		if (images.length === 0) return;
		images.forEach((image) => {
			const img = new window.Image();
			img.src = image.src;
			img.onload = () =>
				setLoadedImages((prev) => ({ ...prev, [image.id]: true }));
			img.onerror = () =>
				setLoadedImages((prev) => ({ ...prev, [image.id]: false }));
		});
	}, [images]);

	// Setup carousel API and track current slide
	useEffect(() => {
		if (!api) return;
		const handleSelect = () => setCurrent(api.selectedScrollSnap());
		api.on('select', handleSelect);
		return () => api.off('select', handleSelect);
	}, [api]);

	// Auto-scroll carousel every 4 seconds if not hovering
	useEffect(() => {
		const interval = setInterval(() => {
			if (api && !isHovering) {
				api.scrollNext();
			}
		}, 4000);
		return () => clearInterval(interval);
	}, [api, isHovering]);

	const allImagesLoaded =
		images.length > 0 && images.every((image) => loadedImages[image.id]);

	return (
		<Carousel
			className="w-full max-w-xl relative mx-auto"
			setApi={setApi}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			opts={{ loop: true }}
			aria-label="Club photo highlights carousel"
		>
			<CarouselContent>
				{!allImagesLoaded ? (
					<div
						className="h-64 w-full animate-pulse bg-gray-300 rounded-2xl shadow-md"
						aria-busy="true"
						aria-label="Loading images"
					/>
				) : (
					images.map((image) => (
						<CarouselItem key={image.id} aria-label={`Slide ${image.id}`}>
							<div className="p-2 flex justify-center">
								<img
									src={image.src}
									alt={image.name || `Club photo ${image.id}`}
									className="rounded-2xl shadow-lg max-h-64 object-cover transition-transform duration-300 hover:scale-105"
									loading="lazy"
								/>
							</div>
						</CarouselItem>
					))
				)}
			</CarouselContent>

			<CarouselPrevious
				className="absolute top-1/2 left-3 -translate-y-1/2 z-20 bg-white bg-opacity-90 border-2 border-red-600 hover:bg-red-600 hover:text-white rounded-full p-3 shadow transition-all"
				aria-label="Previous slide"
			/>
			<CarouselNext
				className="absolute top-1/2 right-3 -translate-y-1/2 z-20 bg-white bg-opacity-90 border-2 border-red-600 hover:bg-red-600 hover:text-white rounded-full p-3 shadow transition-all"
				aria-label="Next slide"
			/>

			{/* Slide indicators */}
			{allImagesLoaded && images.length > 1 && (
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
					{images.map((_, idx) => (
						<span
							key={idx}
							className={`block w-3 h-3 rounded-full transition-all
                ${current === idx ? 'bg-red-600 shadow' : 'bg-gray-300'}`}
							aria-label={`Go to slide ${idx + 1}`}
						/>
					))}
				</div>
			)}
		</Carousel>
	);
}
