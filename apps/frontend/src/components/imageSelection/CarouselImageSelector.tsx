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

interface CarouselImageSelectorProps {
	title: string;
	description: string;
	showKeyLabels?: boolean;
	keyLabels?: string[];
	gridCols?: number;
	imageCount: number;
	useGetAllImages: () => any;
	useReplaceAllImages: () => any;
}

export default function CarouselImageSelector({
	title,
	description,
	showKeyLabels = false,
	keyLabels = [],
	gridCols = 2,
	imageCount,
	useGetAllImages,
	useReplaceAllImages,
}: CarouselImageSelectorProps) {
	const { data: carouselImagesData, isLoading } = useGetAllImages();
	const replaceAllImagesMutation = useReplaceAllImages();
	const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null);
	const [selectorOpen, setSelectorOpen] = useState(false);
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
			const defaultData = Array.from({ length: imageCount }, (_, index) => ({
				imageId: '',
				key: index.toString(),
			}));

			const normalizedData = [...defaultData];

			carouselImages.forEach((existingImage, index) => {
				if (index < imageCount) {
					normalizedData[index] = {
						id: existingImage.id,
						imageId: existingImage.imageId,
						key: index.toString(),
						createdAt: existingImage.createdAt,
						updatedAt: existingImage.updatedAt,
						imageUrl: existingImage.imageUrl,
					};
				}
			});

			setLocalCarouselData(normalizedData);
		} else if (!isLoading && (!carouselImages || carouselImages.length === 0)) {
			const defaultData = Array.from({ length: imageCount }, (_, index) => ({
				imageId: '',
				key: index.toString(),
			}));
			setLocalCarouselData(defaultData);
		}
	}, [carouselImages, isLoading, imageCount]);

	const retrievedData: CarouselImage[] = useMemo(() => {
		if (localCarouselData.length > 0) {
			return localCarouselData;
		}

		return Array.from({ length: imageCount }, (_, index) => ({
			imageId: '',
			key: index.toString(),
		}));
	}, [localCarouselData, imageCount]);

	const handleImageClick = (key: string) => {
		setSelectedImageKey(key);
		setSelectorOpen(true);
	};

	const handleImageSelection = (imageId: string, imageUrl: string) => {
		if (selectedImageKey === null) return;

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
		setSelectorOpen(false);
		setSelectedImageKey(null);
	};

	const handleCloseModal = () => {
		setSelectorOpen(false);
		setSelectedImageKey(null);
	};

	const handleSave = () => {
		const dataToSend = retrievedData
			.filter((item) => item.imageId)
			.map((item) => ({
				key: item.key,
				imageId: item.imageId,
			}));

		replaceAllImagesMutation.mutate(dataToSend);
	};

	const hasChanges = useMemo(() => {
		if (!carouselImages || localCarouselData.length === 0) return false;

		return localCarouselData.some((localItem, index) => {
			const originalItem = carouselImages[index];
			return originalItem?.imageId !== localItem.imageId;
		});
	}, [carouselImages, localCarouselData]);

	const getKeyLabel = (index: number) => {
		if (keyLabels.length > index) {
			return keyLabels[index];
		}
		return `Key: ${index}`;
	};

	const renderCarouselImage = (carouselImage: CarouselImage, index: number) => {
		const keyLabel = getKeyLabel(index);

		if (!carouselImage.imageId) {
			return (
				<div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
					<span className="text-gray-500 text-center px-2">
						Click to add image
					</span>
					{showKeyLabels && (
						<div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
							{keyLabel}
						</div>
					)}
				</div>
			);
		}

		return (
			<div className="w-full h-full bg-blue-100 flex items-center justify-center relative">
				{carouselImage.imageUrl ? (
					<>
						<img
							src={carouselImage.imageUrl}
							alt={keyLabel}
							className="w-full h-full object-cover"
							onError={(e) => {
								console.error('Image failed to load:', carouselImage.imageUrl);
							}}
						/>
						{showKeyLabels && (
							<div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
								{keyLabel}
							</div>
						)}
					</>
				) : (
					<div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
						<span className="text-gray-500 text-center px-2">
							Image ID: {carouselImage.imageId}
						</span>
						{showKeyLabels && (
							<div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
								{keyLabel}
							</div>
						)}
					</div>
				)}
			</div>
		);
	};

	const renderLoadingSkeleton = () =>
		Array.from({ length: imageCount }).map((_, idx) => (
			<div
				key={idx}
				className="aspect-square bg-gray-200 animate-pulse rounded-lg"
			/>
		));

	const gridColsClass =
		{
			2: 'grid-cols-2',
			3: 'grid-cols-3',
			4: 'grid-cols-4',
			5: 'grid-cols-5',
		}[gridCols] || 'grid-cols-2';

	return (
		<>
			<h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
			<p className="text-lg text-gray-600 -mt-3 mb-6">{description}</p>

			<div className={`grid ${gridColsClass} gap-4 max-w-6xl mx-auto`}>
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
