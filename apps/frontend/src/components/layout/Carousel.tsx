import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel';
import { Skeleton } from '../ui/skeleton';
import { Image } from '@wirralbears/shared/types';
import { use } from 'passport';

export function CarouselComponent({ images }: { images: Image[] }) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>(
		{}
	);

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

	useEffect(() => {
		if (!api) return;

		setCount(api.scrollSnapList().length);

		const handleSelect = () => {
			setCurrent(api.selectedScrollSnap());
		};

		api.on('select', handleSelect);

		return () => {
			api.off('select', handleSelect);
		};
	}, [api]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (api && !isHovering) {
				// Always scroll to next, the carousel will loop automatically
				api.scrollNext();
			}
		}, 4000);

		return () => clearInterval(interval);
	}, [api, isHovering]);

	const allImagesLoaded =
		images.length > 0 && images.every((image) => loadedImages[image.id]);

	return (
		<Carousel
			className="min-w-full max-w-xs relative"
			setApi={setApi}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			opts={{ loop: true }}
		>
			<CarouselContent>
				{images.length === 0 || !allImagesLoaded ? (
					<div className="h-80 w-full animate-pulse bg-[var(--muted)]" />
				) : (
					images.map((image) => (
						<CarouselItem key={image.id}>
							<div className="p-1 flex justify-center">
								<img src={image.src} alt="" className="rounded-md" />
							</div>
						</CarouselItem>
					))
				)}
			</CarouselContent>

			<CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-opacity" />
			<CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-opacity" />
		</Carousel>
	);
}
