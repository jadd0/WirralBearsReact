import React, { useState, useEffect } from 'react';
import { ElementWrapper } from './ElementWrapper';
import { ImageUploadAndPreview } from './ImageUploadAndPreview';

interface ImageUploadElementProps {
	element: {
		id: string;
		type: 'image';
		url: string;
		alt: string;
		position?: number;
	};
	onChange: (id: string, updates: any) => void;
	onDelete: (id: string) => void;
	onImageUpload: (file: File) => Promise<string>;
}

export const ImageUploadElement = ({
	element,
	onChange,
	onDelete,
	onImageUpload,
}: ImageUploadElementProps) => {
	// State to track the images
	const [images, setImages] = useState<File[]>([]);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	// Initialize with existing image if URL is provided
	useEffect(() => {
		if (element.url && images.length === 0) {
			// We don't need to set the File object here as we already have the URL
			// Just showing the existing image in the preview will be handled by the component
		}
	}, [element.url, images.length]);

	// Handler to update images
	const handleImagesChange = async (files: File[]) => {
		setImages(files);
		setUploadError(null);

		// If there's at least one file, use the first one to update the element
		if (files.length > 0) {
			try {
				setIsUploading(true);
				// Upload the image and get the URL
				const url = await onImageUpload(files[0]);

				// Update the element with the URL and file reference
				onChange(element.id, {
					url,
					alt: files[0].name,
					file: files[0], // Store the file reference for later use
				});

				setIsUploading(false);
			} catch (error) {
				console.error('Image upload failed:', error);
				setUploadError('Failed to upload image. Please try again.');
				setIsUploading(false);
			}
		} else {
			onChange(element.id, { url: '', alt: '' });
		}
	};

	return (
		<ElementWrapper id={element.id} onDelete={() => onDelete(element.id)}>
			<div className="space-y-2">
				<div className="form-item">
					<label className="form-label">Image</label>
					<div className="form-description">
						Add an image to enhance your content.
					</div>
					<div className="form-control">
						<ImageUploadAndPreview
							images={images}
							setImages={handleImagesChange}
							existingImageUrl={element.url || undefined}
							isUploading={isUploading}
						/>
					</div>
					{uploadError && (
						<p className="text-sm text-red-500 mt-1">{uploadError}</p>
					)}
					<div className="flex justify-between items-center mt-2">
						<p className="text-xs text-gray-400">
							{images.length} image{images.length !== 1 ? 's' : ''}
						</p>
						{element.url && (
							<p className="text-xs text-green-500">
								Image uploaded successfully
							</p>
						)}
					</div>
				</div>
				{element.url && (
					<div className="form-item mt-2">
						<label className="form-label">Alt Text</label>
						<div className="form-description">
							Describe the image for accessibility.
						</div>
						<input
							type="text"
							value={element.alt || ''}
							onChange={(e) => onChange(element.id, { alt: e.target.value })}
							className="w-full px-3 py-2 border rounded-md"
							placeholder="Image description"
						/>
					</div>
				)}
			</div>
		</ElementWrapper>
	);
};
