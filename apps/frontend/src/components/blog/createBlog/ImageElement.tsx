// components/blog/ImageElement.tsx
import { useState } from 'react';
import { ElementWrapper } from './ElementWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon, Upload } from 'lucide-react';
import { ImageElement as ImageElementType } from '@wirralbears/types';

interface ImageElementProps {
	element: ImageElementType;
	onChange: (id: string, updates: Partial<ImageElementType>) => void;
	onDelete: (id: string) => void;
	onImageUpload: (file: File) => Promise<string>;
}

export const ImageElement = ({
	element,
	onChange,
	onDelete,
	onImageUpload,
}: ImageElementProps) => {
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;

		// Clear previous errors
		setError(null);

		// Validate file type
		if (!selectedFile.type.startsWith('image/')) {
			setError('Please select an image file');
			return;
		}

		// Validate file size (4MB max)
		if (selectedFile.size > 4 * 1024 * 1024) {
			setError('Image must be less than 4MB');
			return;
		}

		setFile(selectedFile);

		// Create a preview URL
		const objectUrl = URL.createObjectURL(selectedFile);
		setPreviewUrl(objectUrl);

		// Clean up the previous preview URL if it exists
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	};

	const handleUpload = async () => {
		if (!file) return;

		try {
			setIsUploading(true);
			setError(null);
			const url = await onImageUpload(file);
			onChange(element.id, { url });

			// Clean up the preview URL after successful upload
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
				setPreviewUrl(null);
			}

			setFile(null);
		} catch (err) {
			console.error('Upload failed:', err);
			setError('Failed to upload image. Please try again.');
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<ElementWrapper id={element.id} onDelete={() => onDelete(element.id)}>
			<div className="space-y-4">
				{element.url ? (
					<div className="space-y-4">
						<div className="relative w-full flex justify-center">
							<img
								src={element.url}
								alt={element.alt}
								className="max-h-[300px] rounded-md object-contain"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`alt-${element.id}`}>Alt Text</Label>
							<Input
								id={`alt-${element.id}`}
								value={element.alt}
								onChange={(e) => onChange(element.id, { alt: e.target.value })}
								placeholder="Describe this image"
								className="mt-2"
							/>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						{previewUrl ? (
							<div className="space-y-4">
								<div className="relative w-full flex justify-center">
									<img
										src={previewUrl}
										alt="Preview"
										className="max-h-[300px] rounded-md object-contain"
									/>
								</div>
								<div className="flex justify-center">
									<Button
										onClick={handleUpload}
										disabled={isUploading}
										className="w-full"
									>
										{isUploading ? (
											<span className="flex items-center">
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Uploading...
											</span>
										) : (
											<span className="flex items-center">
												<Upload className="mr-2 h-4 w-4" />
												Upload Image
											</span>
										)}
									</Button>
								</div>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md">
								<div className="flex flex-col items-center justify-center space-y-2">
									<ImageIcon className="h-10 w-10 text-gray-400" />
									<div className="flex flex-col items-center justify-center text-center">
										<p className="text-sm text-gray-500">
											Drag and drop an image, or click to select
										</p>
										<p className="text-xs text-gray-400">
											PNG, JPG, GIF up to 4MB
										</p>
									</div>
									<Input
										id={`file-upload-${element.id}`}
										type="file"
										accept="image/*"
										onChange={handleFileChange}
										className="hidden"
									/>
									<Button
										variant="outline"
										onClick={() =>
											document
												.getElementById(`file-upload-${element.id}`)
												?.click()
										}
										className="mt-2"
									>
										Select Image
									</Button>
								</div>
							</div>
						)}
						{error && (
							<p className="text-sm text-red-500 text-center">{error}</p>
						)}
					</div>
				)}
			</div>
		</ElementWrapper>
	);
};
