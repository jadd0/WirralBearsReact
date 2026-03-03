import React, { useState, useEffect, useCallback } from 'react';
import { ElementWrapper } from './ElementWrapper';
import { Upload, AlertCircle, Info } from 'lucide-react';
import { ImageUploadAndPreview } from './ImageUploadAndPreview';

// Custom hook for image validation logic
const useImageValidation = (
	element: any,
	userInteracted: boolean,
	isValidated: boolean
) => {
	const [uploadError, setUploadError] = useState<string | null>(null);

	const isValidImage = !!(
		element.url ||
		element.localPreviewUrl ||
		element.file
	);
	const isValidAlt = !!(element.alt && element.alt.trim().length > 0);
	const isValid = isValidImage && isValidAlt;

	const validateImage = useCallback((file: File): Promise<void> => {
		return new Promise((resolve, reject) => {
			// Validate file type
			const validImageTypes = [
				'image/jpeg',
				'image/png',
				'image/gif',
				'image/webp',
				'image/svg+xml',
			];
			if (!validImageTypes.includes(file.type)) {
				reject(
					new Error(
						'Invalid file type. Please upload a JPG, PNG, GIF, WebP, or SVG image.'
					)
				);
				return;
			}

			// Validate file size (max 20MB)
			const maxSize = 20 * 1024 * 1024;
			if (file.size > maxSize) {
				reject(new Error('Image is too large. Maximum size is 20MB.'));
				return;
			}

			// Validate that the image can be loaded
			const img = new Image();
			img.onload = () => resolve();
			img.onerror = () =>
				reject(
					new Error(
						'Failed to load image. The file may be corrupted or in an unsupported format.'
					)
				);
			img.src = URL.createObjectURL(file);
		});
	}, []);

	useEffect(() => {
		if (!userInteracted && !isValidated) return;

		if (
			userInteracted &&
			!isValidImage &&
			(element.url !== undefined ||
				element.localPreviewUrl !== undefined ||
				element.file !== undefined)
		) {
			setUploadError('Please select an image');
		} else if (isValidImage && !isValidAlt) {
			setUploadError('Please provide alt text for accessibility');
		} else {
			setUploadError(null);
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

	return {
		isValid,
		isValidImage,
		isValidAlt,
		uploadError,
		setUploadError,
		validateImage,
	};
};

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
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const [isValidated, setIsValidated] = useState<boolean>(false);
	const [userInteracted, setUserInteracted] = useState<boolean>(false);

	const {
		isValid,
		isValidImage,
		isValidAlt,
		uploadError,
		setUploadError,
		validateImage,
	} = useImageValidation(element, userInteracted, isValidated);

	// Handler to update images
	const handleImagesChange = useCallback(
		async (files: File[]) => {
			setUserInteracted(true);
			setIsValidated(files.length > 0);
			setImages(files);
			setUploadError(null);

			if (files.length > 0) {
				const file = files[0];

				try {
					await validateImage(file);
					const localPreviewUrl = URL.createObjectURL(file);

					onChange(element.id, {
						file,
						localPreviewUrl,
						alt: element.alt || file.name,
						position: element.position,
					});
				} catch (error) {
					setUploadError(
						error instanceof Error ? error.message : 'Unknown error occurred'
					);
				}
			} else {
				onChange(element.id, {
					url: '',
					file: undefined,
					localPreviewUrl: undefined,
					alt: element.alt || '',
				});
			}
		},
		[
			element.id,
			element.alt,
			element.position,
			onChange,
			validateImage,
			setUploadError,
		]
	);

	// Handle alt text change
	const handleAltTextChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setUserInteracted(true);
			const newAltText = e.target.value;
			onChange(element.id, { alt: newAltText });

			if (isValidImage && (!newAltText || newAltText.trim().length === 0)) {
				setUploadError('Please provide alt text for accessibility');
				setIsValidated(true);
			} else {
				setUploadError(null);
			}
		},
		[element.id, isValidImage, onChange, setUploadError]
	);

	const handleInteraction = useCallback(() => {
		setUserInteracted(true);
	}, []);

	const previewUrl = element.localPreviewUrl || element.url;

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
						<p className="text-xs text-gray-400">Max size: 20MB</p>
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
