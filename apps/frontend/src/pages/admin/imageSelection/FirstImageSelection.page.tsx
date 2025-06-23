import {
	useGetAllFirstCarouselImages,
	useReplaceAllFirstCarouselImages,
} from '@/hooks/image.hooks';
import AllImagesView from '@/components/image/AllImagesView';
import { useState, useMemo, useEffect } from 'react';

interface CarouselImage {
	id?: string;
	imageId: string;
	key: string;
	createdAt?: Date;
	updatedAt?: Date;
	imageUrl?: string;
}

export default function FirstImageSelectionPage() {
	const { data: carouselImagesData, isLoading } =
		useGetAllFirstCarouselImages();
	const replaceAllImagesMutation = useReplaceAllFirstCarouselImages();
	const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null);
	const [selectorOpen, setSelectorOpen] = useState(false);

	// Add local state to manage carousel updates
	const [localCarouselData, setLocalCarouselData] = useState<CarouselImage[]>(
		[]
	);

	const carouselImages = carouselImagesData as CarouselImage[] | undefined;

	// Update local state when API data changes
	useEffect(() => {
		if (
			carouselImages &&
			Array.isArray(carouselImages) &&
			carouselImages.length > 0
		) {
			// Create default array with 4 placeholder elements
			const defaultData = Array.from({ length: 4 }, (_, index) => ({
				imageId: '',
				key: index.toString(),
			}));

			// Map existing images and append them to the array
			const normalizedData = [...defaultData];

			carouselImages.forEach((existingImage, index) => {
				if (index < 4) {
					normalizedData[index] = {
						id: existingImage.id,
						imageId: existingImage.imageId,
						key: index.toString(),
						createdAt: existingImage.createdAt,
						updatedAt: existingImage.updatedAt,
						imageUrl:
							existingImage.imageUrl
					};
				}
			});

			setLocalCarouselData(normalizedData);
		} else if (!isLoading && (!carouselImages || carouselImages.length === 0)) {
			// Set default empty data if no carousel images
			const defaultData = Array.from({ length: 4 }, (_, index) => ({
				imageId: '',
				key: index.toString(),
			}));
			setLocalCarouselData(defaultData);
		}
	}, [carouselImages, isLoading]);

	// Create a normalized data array with 4 elements
	const retrievedData: CarouselImage[] = useMemo(() => {
		// Use local state if it has data
		if (localCarouselData.length > 0) {
			return localCarouselData;
		}

		// Create default array with 4 placeholder elements as fallback
		return Array.from({ length: 4 }, (_, index) => ({
			imageId: '',
			key: index.toString(),
		}));
	}, [localCarouselData]);

	const handleImageClick = (key: string) => {
		setSelectedImageKey(key);
		setSelectorOpen(true);
	};

	const handleImageSelection = (imageId: string, imageUrl: string) => {
		if (selectedImageKey === null) return;

		// Update the local carousel data
		const updatedCarouselData = retrievedData.map((item, index) => {
			if (index.toString() === selectedImageKey) {
				return {
					...item,
					imageId: imageId,
					imageUrl: imageUrl,
				};
			}
			return item;
		});

		setLocalCarouselData(updatedCarouselData);

		// Close modal and reset selection
		setSelectorOpen(false);
		setSelectedImageKey(null);
	};

	const handleCloseModal = () => {
		setSelectorOpen(false);
		setSelectedImageKey(null);
	};

	// Save function that sends only key and imageId to backend
	const handleSave = () => {
		// Filter out empty images and map to only include key and imageId
		const dataToSend = retrievedData
			.filter((item) => item.imageId) // Only include items with imageId
			.map((item) => ({
				key: item.key,
				imageId: item.imageId,
			}));

		replaceAllImagesMutation.mutate(dataToSend);
	};

	// Check if there are any changes to enable/disable save button
	const hasChanges = useMemo(() => {
		if (!carouselImages || localCarouselData.length === 0) return false;

		return localCarouselData.some((localItem, index) => {
			const originalItem = carouselImages[index];
			return originalItem?.imageId !== localItem.imageId;
		});
	}, [carouselImages, localCarouselData]);

	const renderCarouselImage = (carouselImage: CarouselImage, index: number) => {
		if (!carouselImage.imageId) {
			return (
				<div className="w-full h-full bg-gray-100 flex items-center justify-center">
					<span className="text-gray-500">Click to add image</span>
				</div>
			);
		}

		return (
			<div className="w-full h-full bg-blue-100 flex items-center justify-center">
				{carouselImage.imageUrl ? (
					<img
						src={carouselImage.imageUrl}
						alt=""
						className="w-full h-full object-cover"
						onError={(e) => {
							console.error('Image failed to load:', carouselImage.imageUrl);
						}}
					/>
				) : (
					<div className="w-full h-full bg-gray-200 flex items-center justify-center">
						<span className="text-gray-500">
							Image ID: {carouselImage.imageId}
						</span>
					</div>
				)}
			</div>
		);
	};

	const renderLoadingSkeleton = () =>
		Array.from({ length: 4 }).map((_, idx) => (
			<div
				key={idx}
				className="aspect-square bg-gray-200 animate-pulse rounded-lg"
			/>
		));

	return (
		<>
			<h1 className="text-3xl font-bold mb-8 text-center">
				Image Selection for First Carousel
			</h1>
			<p className="text-lg text-gray-600 -mt-3 mb-6">
				Click on an image to change it
			</p>

			<div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
				{isLoading
					? renderLoadingSkeleton()
					: retrievedData.map((carouselImage, index) => (
							<div
								key={carouselImage.key}
								className="aspect-square cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
								onClick={() => handleImageClick(carouselImage.key)}
							>
								{renderCarouselImage(carouselImage, index)}
							</div>
					  ))}
			</div>

			{/* Save Button */}
			<div className="flex justify-center mt-8 mb-10">
				<button
					onClick={handleSave}
					disabled={!hasChanges || replaceAllImagesMutation.isPending}
					className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
						hasChanges && !replaceAllImagesMutation.isPending
							? 'bg-blue-600 hover:bg-blue-700 text-white'
							: 'bg-gray-300 text-gray-500 cursor-not-allowed'
					}`}
				>
					{replaceAllImagesMutation.isPending ? 'Saving...' : 'Save Changes'}
				</button>
			</div>

			{selectorOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
					<div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold">Select an Image</h2>
							<button
								onClick={handleCloseModal}
								className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
								aria-label="Close modal"
							>
								✕
							</button>
						</div>
						<AllImagesView
							popUpActivated={false}
							deleteImage={false}
							clickable={true}
							onImageClick={handleImageSelection}
						/>
					</div>
				</div>
			)}
		</>
	);
}
