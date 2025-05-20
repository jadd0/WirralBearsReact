import React, { useCallback } from 'react';
import { FileUploader, FileInput } from '@/components/ui/file-upload';
import { ImagePlus, Trash2 } from 'lucide-react';

const DROPZONE_CONFIG = {
	maxFiles: 1, // Changed to 1 since we're only handling one image per element
	maxSize: 5 * 1024 * 1024, // 5MB
	multiple: false, // Changed to false for single image uploads
	accept: {
		'image/*': [],
	},
};

export function ImageUploadAndPreview({
	images,
	setImages,
	existingImageUrl,
	isUploading = false,
}: {
	images: File[];
	setImages: (files: File[]) => void;
	existingImageUrl?: string;
	isUploading?: boolean;
}) {
	// Generate preview URLs for the images
	const imagePreviewUrls = React.useMemo(() => {
		return images.map((image) => URL.createObjectURL(image));
	}, [images]);

	// Cleanup effect for the preview URLs
	React.useEffect(() => {
		return () => {
			imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [imagePreviewUrls]);

	// Handler to delete an image
	const handleDeleteImage = useCallback(() => {
		setImages([]);
	}, [setImages]);

	// Determine what to display: local preview, existing image, or upload area
	const hasLocalPreview = imagePreviewUrls.length > 0;
	const hasExistingImage = !hasLocalPreview && existingImageUrl;
	const showUploadArea = !hasLocalPreview && !hasExistingImage;

	return (
		<div className="space-y-4">
			{showUploadArea && (
				<FileUploader
					value={images}
					onValueChange={(files) => files && setImages(files)}
					dropzoneOptions={DROPZONE_CONFIG}
					className="w-full p-0.5"
					disabled={isUploading}
				>
					<FileInput className="w-full overflow-hidden flex flex-col items-center justify-center border-dashed border-2 p-6 rounded-md">
						<div className="w-full rounded-xl flex flex-col gap-2 items-center justify-center">
							{isUploading ? (
								<>
									<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500"></div>
									<p className="mb-1 text-sm text-gray-500">Uploading...</p>
								</>
							) : (
								<>
									<ImagePlus className="text-gray-500 w-10 h-10" />
									<p className="mb-1 text-sm text-gray-500">
										<span className="font-semibold">Click to upload</span> or
										drag and drop
									</p>
									<p className="text-xs text-gray-400">
										PNG, JPG or GIF (max. 5MB)
									</p>
								</>
							)}
						</div>
					</FileInput>
				</FileUploader>
			)}

			{hasLocalPreview && (
				<div className="relative aspect-video w-full">
					<img
						src={imagePreviewUrls[0]}
						alt="Preview"
						className="w-full h-full object-cover rounded-md"
					/>
					<button
						type="button"
						onClick={handleDeleteImage}
						className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:stroke-destructive"
						disabled={isUploading}
					>
						<Trash2 className="w-5 h-5" />
					</button>
					{isUploading && (
						<div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
							<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
						</div>
					)}
				</div>
			)}

			{hasExistingImage && (
				<div className="relative aspect-video w-full">
					<img
						src={existingImageUrl}
						alt="Uploaded image"
						className="w-full h-full object-cover rounded-md"
					/>
					<button
						type="button"
						onClick={() => setImages([])}
						className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:stroke-destructive"
					>
						<Trash2 className="w-5 h-5" />
					</button>
				</div>
			)}
		</div>
	);
}
