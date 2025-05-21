import React, { useState, useEffect } from 'react';
import { ElementWrapper } from './ElementWrapper';
import { Upload, AlertCircle, Info } from 'lucide-react';
import { ImageUploadAndPreview } from './ImageUploadAndPreview';

interface ImageUploadElementProps {
	element: {
		id: string;
		type: 'image';
		url?: string | undefined;
		alt: string;
		position?: number | undefined;
		file?: File | null | undefined;
		localPreviewUrl?: string | undefined;
	};
	onImageUpload: (file: File) => Promise<string>;
	onChange: (id: string, updates: any) => void;
	onDelete: (id: string) => void;
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
	const [isValidated, setIsValidated] = useState<boolean>(false);
	const [userInteracted, setUserInteracted] = useState<boolean>(false);

	// Validate image and alt text
	const isValidImage = !!(
		element.url ||
		element.localPreviewUrl ||
		element.file
	);
	const isValidAlt = !!(element.alt && element.alt.trim().length > 0);
	const isValid = isValidImage && isValidAlt;

	useEffect(() => {
		// Only validate after user interaction or explicit validation request
		if (!userInteracted && !isValidated) {
			return;
		}

		// Only show validation errors when appropriate
		if (userInteracted || isValidated) {
			// Only check for image if user has attempted to upload one
			if (
				userInteracted &&
				!isValidImage &&
				(element.url !== undefined ||
					element.localPreviewUrl !== undefined ||
					element.file !== undefined)
			) {
				setUploadError('Please select an image');
			}
			// Only check alt text if there's an image present
			else if (isValidImage && !isValidAlt) {
				setUploadError('Please provide alt text for accessibility');
			} else {
				setUploadError(null);
			}
		}
	}, [
		isValidImage,
		isValidAlt,
		element.url,
		element.localPreviewUrl,
		element.file,
		isValidated,
		userInteracted,
	]);

	// Validate image when component mounts or updates - but only after user interaction
	useEffect(() => {
		// Only show validation errors if user has interacted with the component or if explicitly validating (e.g., on form submission)
		if (!userInteracted && !isValidated) {
			return;
		}

		if (!isValidImage) {
			setUploadError('Please select an image');
		} else if (!isValidAlt && (element.url || element.localPreviewUrl)) {
			setUploadError('Please provide alt text for accessibility');
		} else {
			setUploadError(null);
		}
	}, [
		isValidImage,
		isValidAlt,
		element.url,
		element.localPreviewUrl,
		isValidated,
		userInteracted,
	]);

	// Handler to update images
	const handleImagesChange = async (files: File[]) => {
		setUserInteracted(true);
		// Only validate if files are being added or removed
		setIsValidated(files.length > 0);
		setImages(files);

		// Clear previous errors when changing files
		setUploadError(null);

		// If there's at least one file, validate and store it
		if (files.length > 0) {
			const file = files[0];

			// Validate file type
			const validImageTypes = [
				'image/jpeg',
				'image/png',
				'image/gif',
				'image/webp',
				'image/svg+xml',
			];
			if (!validImageTypes.includes(file.type)) {
				setUploadError(
					'Invalid file type. Please upload a JPG, PNG, GIF, WebP, or SVG image.'
				);
				return;
			}

			// Validate file size (max 5MB)
			const maxSize = 5 * 1024 * 1024; // 5MB in bytes
			if (file.size > maxSize) {
				setUploadError('Image is too large. Maximum size is 5MB.');
				return;
			}

			try {
				// Create a local preview URL
				const localPreviewUrl = URL.createObjectURL(file);

				// Validate that the image can be loaded
				await validateImageLoads(localPreviewUrl);

				// Update the element with the file reference and local preview URL
				onChange(element.id, {
					file,
					localPreviewUrl,
					alt: element.alt || file.name,
					position: element.position,
				});
			} catch (error) {
				setUploadError(
					'Failed to load image. The file may be corrupted or in an unsupported format.'
				);
			}
		} else {
			// If no files, clear the element but maintain alt text
			onChange(element.id, {
				url: '',
				file: undefined,
				localPreviewUrl: undefined,
				alt: element.alt || '',
			});
		}
	};

	// Function to validate that an image can be loaded
	const validateImageLoads = (src: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve();
			img.onerror = () => reject(new Error('Failed to load image'));
			img.src = src;
		});
	};

	// Handle alt text change
	const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserInteracted(true);
		const newAltText = e.target.value;
		onChange(element.id, { alt: newAltText });

		// Only validate alt text if there's an image and the field is being cleared
		if (isValidImage && (!newAltText || newAltText.trim().length === 0)) {
			setUploadError('Please provide alt text for accessibility');
			setIsValidated(true);
		} else {
			// Clear any existing error if alt text is valid
			setUploadError(null);
		}
	};

	// Determine which URL to use for preview
	const previewUrl = element.localPreviewUrl || element.url;

	// Function to mark component as interacted with
	const handleInteraction = () => {
		setUserInteracted(true);
	};

	return (
		<ElementWrapper id={element.id} onDelete={() => onDelete(element.id)}>
			<div
				className={`space-y-4 p-4 bg-white rounded-lg shadow-sm ${
					!isValid && isValidated && userInteracted
						? 'border border-red-300'
						: ''
				}`}
				onClick={handleInteraction}
			>
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

					{uploadError && userInteracted && (
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

				<div
					className={`form-item mt-4 border-t pt-4 ${
						!isValidAlt && isValidImage && isValidated && userInteracted
							? 'border-red-200 bg-red-50 p-3 rounded-md'
							: ''
					}`}
				>
					<label className="block text-md font-medium text-gray-700 mb-1">
						Alt Text <span className="text-red-500">*</span>
					</label>
					<div className="flex items-start gap-2 mb-2">
						<Info size={16} className="text-gray-400 mt-0.5" />
						<p className="text-sm text-gray-500">
							Describe the image for accessibility and SEO purposes. This is
							required for all images.
						</p>
					</div>
					<input
						type="text"
						value={element.alt || ''}
						onChange={handleAltTextChange}
						className={`w-full px-3 py-2 border ${
							!isValidAlt && isValidImage && isValidated && userInteracted
								? 'border-red-300 focus:border-red-500 focus:ring-red-500'
								: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
						} rounded-md shadow-sm transition-all`}
						placeholder="e.g., 'Team meeting in conference room'"
						required={isValidImage}
						onFocus={handleInteraction}
						onBlur={() => setIsValidated(true)}
					/>
					{!isValidAlt && isValidImage && isValidated && userInteracted && (
						<p className="text-sm text-red-500 mt-1">
							Alt text is required for accessibility
						</p>
					)}
				</div>
			</div>
		</ElementWrapper>
	);
};
