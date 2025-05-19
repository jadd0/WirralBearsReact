import { useState, useEffect } from 'react';
import { ElementWrapper } from './ElementWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon, Upload, X } from 'lucide-react';
import { ImageElement as ImageElementType } from '@wirralbears/types';
import { toast } from 'sonner';

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
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	// Clean up preview URL when component unmounts
	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;
		processFile(selectedFile);
	};

	const processFile = (selectedFile: File) => {
		// Validate file type
		if (!selectedFile.type.startsWith('image/')) {
			toast.error('Invalid file type', {
				description: 'Please select an image file',
			});
			return;
		}

		// Validate file size (4MB max)
		if (selectedFile.size > 4 * 1024 * 1024) {
			toast.error('File too large', {
				description: 'Image must be less than 4MB',
			});
			return;
		}

		setFile(selectedFile);

		// Create a preview URL
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		const objectUrl = URL.createObjectURL(selectedFile);
		setPreviewUrl(objectUrl);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			processFile(e.dataTransfer.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		try {
			setIsUploading(true);
			const url = await onImageUpload(file);
			onChange(element.id, { url });

			// Clean up the preview URL after successful upload
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
				setPreviewUrl(null);
			}

			setFile(null);

			toast.success('Image uploaded', {
				description: 'Your image has been uploaded successfully',
			});
		} catch (err) {
			console.error('Upload failed:', err);
			toast.error('Upload failed', {
				description: 'Failed to upload image. Please try again.',
			});
		} finally {
			setIsUploading(false);
		}
	};

	const cancelUpload = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setPreviewUrl(null);
		setFile(null);
	};

	return (
		<ElementWrapper id={element.id} onDelete={() => onDelete(element.id)}>
			<div className="space-y-4">
				{element.url ? (
					<div className="space-y-4">
						<div className="relative w-full flex justify-center bg-gray-50 rounded-lg p-2">
							<img
								src={element.url}
								alt={element.alt}
								className="max-h-[300px] rounded-md object-contain shadow-sm"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor={`alt-${element.id}`}
								className="text-sm font-medium"
							>
								Image Description (Alt Text)
							</Label>
							<Input
								id={`alt-${element.id}`}
								value={element.alt}
								onChange={(e) => onChange(element.id, { alt: e.target.value })}
								placeholder="Describe this image for accessibility"
								className="mt-1"
							/>
							<p className="text-xs text-gray-500">
								Adding a description helps visually impaired readers understand
								your image
							</p>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						{previewUrl ? (
							<div className="space-y-4">
								<div className="relative w-full flex justify-center bg-gray-50 rounded-lg p-2">
									<img
										src={previewUrl}
										alt="Preview"
										className="max-h-[300px] rounded-md object-contain"
									/>
									<Button
										variant="ghost"
										size="icon"
										className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
										onClick={cancelUpload}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
								<div className="flex justify-center gap-3">
									<Button
										onClick={handleUpload}
										disabled={isUploading}
										className="w-full bg-blue-600 hover:bg-blue-700"
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
							<div
								className={`flex flex-col items-center justify-center p-8 border-2 ${
									isDragging
										? 'border-blue-400 bg-blue-50'
										: 'border-dashed border-gray-300'
								} rounded-lg transition-all hover:border-blue-300 hover:bg-gray-50`}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
							>
								<div className="flex flex-col items-center justify-center space-y-3">
									<div
										className={`p-3 rounded-full ${
											isDragging ? 'bg-blue-100' : 'bg-gray-100'
										} transition-colors`}
									>
										<ImageIcon
											className={`h-8 w-8 ${
												isDragging ? 'text-blue-500' : 'text-gray-500'
											}`}
										/>
									</div>
									<div className="flex flex-col items-center justify-center text-center">
										<p className="text-sm font-medium text-gray-700">
											{isDragging
												? 'Drop your image here'
												: 'Drag and drop an image here'}
										</p>
										<p className="text-xs text-gray-500 mt-1">
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
									<div className="pt-2">
										<Button
											variant="outline"
											onClick={() =>
												document
													.getElementById(`file-upload-${element.id}`)
													?.click()
											}
											className="mt-2"
										>
											Browse Files
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</ElementWrapper>
	);
};
