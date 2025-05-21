import React, { useState, useEffect } from 'react';
import { ElementWrapper } from './ElementWrapper';
import { FileUploader, FileInput } from '@/components/ui/file-upload';
import { ImagePlus, Trash2, Upload, AlertCircle, Info } from 'lucide-react';
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
	const [images, setImages] = useState<File[]>([]);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isHovering, setIsHovering] = useState<boolean>(false);

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
			<div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
				<div className="form-item">
					<div className="flex items-center justify-between mb-2">
						<label className="text-lg font-medium text-gray-800">Image</label>
						{element.file && (
							<div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
								<Upload size={14} />
								<span>Ready to upload</span>
							</div>
						)}
					</div>
					<p className="text-sm text-gray-500 mb-3">
						Add an image to enhance your content. Recommended size: 1200×630px.
					</p>

					<div className="form-control">
						<ImageUploadAndPreview
							images={images}
							setImages={handleImagesChange}
							existingImageUrl={previewUrl || undefined}
							isUploading={isUploading}
							onHover={setIsHovering}
						/>
					</div>

					{uploadError && (
						<div className="flex items-center gap-2 text-sm text-red-500 mt-2 p-2 bg-red-50 rounded-md">
							<AlertCircle size={16} />
							<p>{uploadError}</p>
						</div>
					)}

					<div className="flex justify-between items-center mt-2">
						<p className="text-xs text-gray-400">
							{images.length > 0
								? `${images.length} image selected`
								: 'No image selected'}
						</p>
						<p className="text-xs text-gray-400">Max size: 5MB</p>
					</div>
				</div>

				{(element.url || element.file) && (
					<div className="form-item mt-4 border-t pt-4">
						<label className="block text-md font-medium text-gray-700 mb-1">
							Alt Text
						</label>
						<div className="flex items-start gap-2 mb-2">
							<Info size={16} className="text-gray-400 mt-0.5" />
							<p className="text-sm text-gray-500">
								Describe the image for accessibility and SEO purposes.
							</p>
						</div>
						<input
							type="text"
							value={element.alt || ''}
							onChange={(e) => onChange(element.id, { alt: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm transition-all"
							placeholder="e.g., 'Team meeting in conference room'"
						/>
					</div>
				)}
			</div>
		</ElementWrapper>
	);
};
