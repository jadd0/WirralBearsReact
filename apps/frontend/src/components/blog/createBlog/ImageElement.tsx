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
		file?: File;
		localPreviewUrl?: string;
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
		if (element.file && images.length === 0) {
			setImages([element.file]);
		}
	}, [element.file, images.length]);

	// Handler to update images
	const handleImagesChange = async (files: File[]) => {
		setImages(files);
		setUploadError(null);

		// If there's at least one file, store it without uploading
		if (files.length > 0) {
			const file = files[0];
			const localPreviewUrl = URL.createObjectURL(file);

			// Update the element with the file reference and local preview URL
			onChange(element.id, {
				file,
				localPreviewUrl,
				alt: file.name,
				position: element.position, // Preserve the position
			});
		} else {
			// If no files, clear the element
			onChange(element.id, {
				url: '',
				alt: '',
				file: undefined,
				localPreviewUrl: undefined,
			});
		}
	};

	// Determine which URL to use for preview
	const previewUrl = element.localPreviewUrl || element.url;

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
							existingImageUrl={previewUrl || undefined}
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
						{element.file && (
							<p className="text-xs text-blue-500">
								Image selected (will be uploaded when saved)
							</p>
						)}
					</div>
				</div>
				{(element.url || element.file) && (
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
