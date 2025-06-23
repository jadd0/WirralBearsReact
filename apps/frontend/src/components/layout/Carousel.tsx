import React, { useEffect, useState } from 'react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel';

interface CarouselImage {
	id?: string;
	imageId: string;
	key: string;
	createdAt?: Date;
	updatedAt?: Date;
	imageUrl?: string;
}

type CarouselComponentProps = {
	images: CarouselImage[];
	headings?: string[];
	isLoading?: boolean;
};

export function CarouselComponent({
	images,
	headings,
	isLoading = false,
}: CarouselComponentProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
		{}
	);

	// Preload images and track loading status
	useEffect(() => {
		if (images.length === 0) return;
		images.forEach((image) => {
			if (!image?.imageUrl) return;
			const img = new window.Image();
			img.src = image.imageUrl;
			const imageKey = image.id || image.imageId;
			img.onload = () =>
				setLoadedImages((prev) => ({ ...prev, [imageKey]: true }));
			img.onerror = () =>
				setLoadedImages((prev) => ({ ...prev, [imageKey]: false }));
		});
	}, [images]);

	// Setup carousel API and track current slide
	useEffect(() => {
		if (!api) return;
		const handleSelect = () => setCurrent(api.selectedScrollSnap());
		api.on('select', handleSelect);
		return () => {
			api.off('select', handleSelect);
		};
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
		images.length > 0 &&
		images.every((image) => {
			const imageKey = image.id || image.imageId;
			return image?.imageUrl && loadedImages[imageKey];
		});

	return (
		<div className="w-full max-w-xl relative mx-auto">
			<Carousel
				setApi={setApi}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				opts={{ loop: true }}
				aria-label="Club photo highlights carousel"
			>
				<CarouselContent>
					{!allImagesLoaded || isLoading ? (
						<div
							className="h-64 w-full animate-pulse bg-gray-300 rounded-2xl shadow-md"
							aria-busy="true"
							aria-label="Loading images"
						/>
					) : (
						images.map((image, idx) => {
							const imageKey = image.id || image.imageId;
							return (
								<CarouselItem key={imageKey} aria-label={`Slide ${idx + 1}`}>
									<div className="p-2 flex flex-col items-center">
										<img
											src={image.imageUrl}
											alt={`Club photo ${image.key || idx + 1}`}
											className="rounded-2xl shadow-lg max-h-64 object-cover transition-transform duration-300 hover:scale-105"
											loading="lazy"
										/>
									</div>
								</CarouselItem>
							);
						})
					)}
				</CarouselContent>

				<CarouselPrevious
					className="absolute top-1/2 left-3 -translate-y-1/2 z-20 bg-white bg-opacity-90 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full p-3 shadow transition-all"
					aria-label="Previous slide"
				/>
				<CarouselNext
					className="absolute top-1/2 right-3 -translate-y-1/2 z-20 bg-white bg-opacity-90 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full p-3 shadow transition-all"
					aria-label="Next slide"
				/>
			</Carousel>

			{/* Below the carousel: heading and dots */}
			{allImagesLoaded && images.length > 1 && (
				<div className="flex flex-col items-center mt-4">
					{headings && headings[current] && (
						<div className="mb-2 text-white font-semibold text-lg drop-shadow">
							{headings[current]}
						</div>
					)}
					<div className="flex space-x-2">
						{images.map((_, idx) => (
							<span
								key={idx}
								className={`block w-3 h-3 rounded-full transition-all cursor-pointer ${
									current === idx ? 'bg-red-600 shadow' : 'bg-gray-300'
								}`}
								aria-label={`Go to slide ${idx + 1}`}
								onClick={() => api?.scrollTo(idx)}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
