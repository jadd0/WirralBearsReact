import { useGetAllImages } from '@/hooks/image.hooks';
import ImageDisplay from './Image';

export default function AllImagesView({ deleteImage, popUpActivated = true }) {
	const { data, isLoading } = useGetAllImages();

	// Skeleton component for loading state
	const ImageSkeleton = () => (
		<div className="aspect-square bg-gray-200 animate-pulse rounded-lg w-full h-full" />
	);

	return (
		<div className="flex flex-col min-h-screen px-8 sm:px-4">
			<h1 className="text-3xl font-bold mb-4 text-center">Image Gallery</h1>
			<p className="text-lg text-gray-600 text-center">
					View a collection of images taken at games, training etc.
				</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto mt-10">
				{isLoading
					? Array.from({ length: 6 }).map((_, idx) => (
							<ImageSkeleton key={idx} />
					  ))
					: data?.pages.map((page, pageIndex) =>
							page.images.map((image, imgIndex) => (
								<ImageDisplay
									key={`${pageIndex}-${image.id || imgIndex}`}
									image={image}
									deleteImage={deleteImage}
									popUpActivated={popUpActivated}
								/>
							))
					  )}
			</div>
		</div>
	);
}
