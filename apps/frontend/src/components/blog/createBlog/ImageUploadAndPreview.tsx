import React from 'react';
import { FileUploader, FileInput } from '@/components/ui/file-upload';
import { ImagePlus, Trash2 } from 'lucide-react';
import { IMAGE_UPLOAD_CONFIG } from '@wirralbears/constants';


export function ImageUploadAndPreview({
	images,
	setImages,
	existingImageUrl,
	isUploading = false,
	onHover,
}: {
	images: File[];
	setImages: (files: File[]) => void;
	existingImageUrl?: string;
	isUploading?: boolean;
	onHover?: (hovering: boolean) => void;
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
	const handleDeleteImage = React.useCallback(() => {
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
					dropzoneOptions={IMAGE_UPLOAD_CONFIG}
					className="w-full p-0.5"
				>
					<FileInput
						className="w-full overflow-hidden flex flex-col items-center justify-center border-dashed border-2 border-gray-300 hover:border-blue-400 p-8 rounded-lg transition-all duration-200 bg-gray-50 hover:bg-blue-50"
						onMouseEnter={() => onHover && onHover(true)}
						onMouseLeave={() => onHover && onHover(false)}
					>
						<div className="w-full rounded-xl flex flex-col gap-3 items-center justify-center">
							{isUploading ? (
								<>
									<div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
									<p className="mb-1 text-sm font-medium text-gray-600">
										Uploading...
									</p>
								</>
							) : (
								<>
									<div className="p-4 bg-blue-100 rounded-full">
										<ImagePlus className="text-blue-500 w-8 h-8" />
									</div>
									<p className="mb-1 text-sm text-gray-700">
										<span className="font-semibold text-blue-600">
											Click to upload
										</span>{' '}
										or drag and drop
									</p>
									<p className="text-xs text-gray-500">
										PNG, JPG or GIF (max. 5MB)
									</p>
								</>
							)}
						</div>
					</FileInput>
				</FileUploader>
			)}

			{(hasLocalPreview || hasExistingImage) && (
				<div
					className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md group"
					onMouseEnter={() => onHover && onHover(true)}
					onMouseLeave={() => onHover && onHover(false)}
				>
					<img
						src={hasLocalPreview ? imagePreviewUrls[0] : existingImageUrl}
						alt="Preview"
						className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>

					{/* Overlay with actions */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
						<div className="flex justify-between items-center">
							<p className="text-white text-sm truncate max-w-[80%]">
								{hasLocalPreview ? images[0].name : 'Uploaded image'}
							</p>
							<button
								type="button"
								onClick={
									hasLocalPreview ? handleDeleteImage : () => setImages([])
								}
								className="bg-white/20 backdrop-blur-sm hover:bg-red-500 text-white rounded-full p-2 transition-colors duration-200"
								disabled={isUploading}
							>
								<Trash2 className="w-5 h-5" />
							</button>
						</div>
					</div>

					{/* Loading overlay */}
					{isUploading && (
						<div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-md">
							<div className="flex flex-col items-center gap-2">
								<div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
								<p className="text-white font-medium">Uploading image...</p>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
