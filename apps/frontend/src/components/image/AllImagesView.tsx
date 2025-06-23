import { useGetAllImages } from '@/hooks/image.hooks';
import ImageDisplay from './Image';
import { useRef, useCallback, useEffect } from 'react';

interface AllImagesViewProps {
	deleteImage?: boolean;
	popUpActivated?: boolean;
	clickable?: boolean;
	onImageClick?: (imageId: string, imageUrl: string) => void;
	data?: any;
	isLoading?: boolean;
}

export default function AllImagesView({
	deleteImage = false,
	popUpActivated = true,
	clickable = false,
	onImageClick = (imageId: string, imageUrl: string) => {},
	data: propData,
	isLoading: propIsLoading = false,
}: AllImagesViewProps) {
	// Only call the hook if no data is provided via props
	const shouldFetchData = !propData;
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		shouldFetchData
			? useGetAllImages()
			: {
					data: null,
					isLoading: false,
					fetchNextPage: () => {},
					hasNextPage: false,
					isFetchingNextPage: false,
			  };

	// Use prop data if provided, otherwise use hook data
	const finalData = propData || data;
	const finalIsLoading = propData ? propIsLoading : isLoading;

	// Ref for the last image element to observe
	const lastImageRef = useRef<HTMLDivElement>(null);

	// Intersection Observer callback
	const lastImageElementRef = useCallback(
		(node: HTMLDivElement) => {
			if (finalIsLoading || isFetchingNextPage) return;
			if (lastImageRef.current) lastImageRef.current = null;

			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && hasNextPage && shouldFetchData) {
						fetchNextPage();
					}
				},
				{
					threshold: 0.1,
					rootMargin: '100px',
				}
			);

			if (node) {
				observer.observe(node);
				lastImageRef.current = node;
			}

			return () => {
				if (lastImageRef.current) {
					observer.unobserve(lastImageRef.current);
				}
			};
		},
		[
			finalIsLoading,
			isFetchingNextPage,
			hasNextPage,
			fetchNextPage,
			shouldFetchData,
		]
	);

	// Skeleton component for loading state
	const ImageSkeleton = () => (
		<div className="aspect-square bg-gray-200 animate-pulse rounded-lg w-full h-full" />
	);

	// Get all images from all pages
	const allImages =
		finalData?.pages?.flatMap((page: any) => page.images || []) || [];

	return (
		<div className="flex flex-col min-h-screen px-8 sm:px-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto mt-10">
				{finalIsLoading && allImages.length === 0
					? Array.from({ length: 6 }).map((_, idx) => (
							<ImageSkeleton key={idx} />
					  ))
					: allImages.map((image: any, index: number) => {
							const isLastImage = index === allImages.length - 1;
							return (
								<div
									key={image.id || index}
									ref={isLastImage ? lastImageElementRef : null}
								>
									<ImageDisplay
										image={image}
										deleteImage={deleteImage}
										popUpActivated={popUpActivated}
										clickable={clickable}
										onImageClick={onImageClick}
									/>
								</div>
							);
					  })}
			</div>

			{/* Loading indicator for next page */}
			{isFetchingNextPage && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto mt-4">
					{Array.from({ length: 3 }).map((_, idx) => (
						<ImageSkeleton key={`loading-${idx}`} />
					))}
				</div>
			)}

			{/* End of results indicator */}
			{!hasNextPage && allImages.length > 0 && (
				<div className="text-center py-8 text-gray-500">
					No more images to load
				</div>
			)}
		</div>
	);
}
