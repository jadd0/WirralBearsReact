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
import { Image } from '@wirralbears-monorepo/shared/types';

export function CarouselComponent({ images }: { images: Image[] }) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [isHovering, setIsHovering] = useState(false);

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
		}, 2500);

		return () => clearInterval(interval);
	}, [api, isHovering]);

	return (
		<Carousel
			className="w-full max-w-xs"
			setApi={setApi}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			opts={{
				loop: true,
			}}
		>
			<CarouselContent>
				{images.map((image) => (
					<CarouselItem key={image.id}>
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<img src={image.src} alt="" />
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
