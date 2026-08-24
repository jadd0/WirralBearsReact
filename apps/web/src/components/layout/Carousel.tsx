'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
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

type GalleryCarouselProps = {
	images: CarouselImage[];
	isLoading?: boolean;
};

/** Shared across the rail, the loading skeleton and the sizes attribute. */
const SLIDE_BASIS =
	'basis-[82%] sm:basis-1/2 lg:basis-[38%] xl:basis-1/3';

export function GalleryCarousel({
	images,
	isLoading = false,
}: GalleryCarouselProps) {
	const [api, setApi] = useState<CarouselApi>();
	// A stable empty array on the first render, so passing `plugins` does not
	// re-init embla on every render. Populated once, after the reduced-motion
	// check, which cannot run during SSR.
	const [plugins, setPlugins] = useState<NonNullable<
		Parameters<typeof Carousel>[0]['plugins']
	>>([]);

	const trackRef = useRef<HTMLDivElement>(null);
	const lastSnap = useRef(0);

	const photos = images.filter((image) => Boolean(image.imageUrl));
	const hasRail = photos.length > 1;

	useEffect(() => {
		if (photos.length < 3) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		setPlugins([
			Autoplay({
				delay: 4500,
				stopOnInteraction: false,
				stopOnMouseEnter: true,
			}),
		]);
	}, [photos.length]);

	// Position indicator. Written straight to the node so a slide change does
	// not re-render the rail.
	useEffect(() => {
		if (!api) return;

		const update = () => {
			const el = trackRef.current;
			if (!el) return;

			const count = api.scrollSnapList().length || 1;
			const index = api.selectedScrollSnap();
			// Looping back from the last snap to the first would otherwise
			// animate the indicator all the way across the track in reverse.
			const wrapped = Math.abs(index - lastSnap.current) > 1;

			if (wrapped) el.style.transition = 'none';
			el.style.width = `${100 / count}%`;
			el.style.transform = `translateX(${index * 100}%)`;
			if (wrapped) {
				void el.offsetWidth;
				el.style.transition = '';
			}
			lastSnap.current = index;
		};

		update();
		api.on('select', update);
		api.on('reInit', update);
		return () => {
			api.off('select', update);
			api.off('reInit', update);
		};
	}, [api]);

	if (isLoading) {
		return (
			<div aria-busy="true" aria-label="Loading photographs">
				<div className="overflow-hidden">
					<div className="-ml-4 flex">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={`photo-skeleton-${index}`}
								className={`min-w-0 shrink-0 grow-0 pl-4 ${SLIDE_BASIS}`}
							>
								<div className="aspect-[4/3] animate-pulse rounded-2xl bg-line/70" />
							</div>
						))}
					</div>
				</div>
				<div className="mt-6 h-[3px] w-full rounded-full bg-line-strong/50" />
			</div>
		);
	}

	// The section around this is only rendered when there is something to show,
	// so there is no empty panel to build here.
	if (photos.length === 0) return null;

	return (
		<div>
			<Carousel
				setApi={setApi}
				plugins={plugins}
				opts={{ loop: photos.length >= 4, align: 'start' }}
				aria-label="Recent photographs from club sessions"
			>
				<CarouselContent>
					{photos.map((photo, index) => (
						<CarouselItem
							key={photo.id || photo.imageId}
							className={SLIDE_BASIS}
						>
							<div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
								<Image
									src={photo.imageUrl as string}
									alt={`Wirral Bears club photograph ${index + 1} of ${photos.length}`}
									fill
									sizes="(min-width: 1280px) 25rem, (min-width: 1024px) 36vw, (min-width: 640px) 47vw, 82vw"
									className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{hasRail && (
				<div className="mt-6 flex items-center gap-6">
					<div className="h-[3px] flex-1 overflow-hidden rounded-full bg-line-strong/50">
						<div
							ref={trackRef}
							className="h-full rounded-full bg-brand transition-transform duration-300 ease-out"
						/>
					</div>
					<div className="hidden shrink-0 gap-2 sm:flex">
						<button
							type="button"
							onClick={() => api?.scrollPrev()}
							aria-label="Previous photographs"
							className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-surface text-ink transition-all duration-200 hover:-translate-y-px hover:bg-paper active:translate-y-0 active:scale-[0.98]"
						>
							<ArrowLeft className="h-5 w-5" aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={() => api?.scrollNext()}
							aria-label="Next photographs"
							className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-surface text-ink transition-all duration-200 hover:-translate-y-px hover:bg-paper active:translate-y-0 active:scale-[0.98]"
						>
							<ArrowRight className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
