import { useState } from 'react';
import { useUploadMultipleImages } from '@/hooks/blog.hooks';
import { MultipleImageUploader } from '@/components/image/MultipleImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	AlertCircle,
	CheckCircle,
	Upload,
	Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadedImage {
	id: string;
	url: string;
	key: string;
	alt: string;
	originalName: string;
	index: number;
}

export default function MultipleImageUploadPage() {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [altTexts, setAltTexts] = useState<string[]>([]);
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
	const [isPreviewMode, setIsPreviewMode] = useState(false);

	const uploadMutation = useUploadMultipleImages();

	// Handle file selection
	const handleFilesChange = (files: File[]) => {
		setSelectedFiles(files);
		// Initialise alt texts array with default values
		setAltTexts(files.map((file, index) => `Image ${index + 1}: ${file.name}`));
	};

	// Handle alt text changes
	const handleAltTextChange = (index: number, value: string) => {
		const newAltTexts = [...altTexts];
		newAltTexts[index] = value;
		setAltTexts(newAltTexts);
	};

	// Handle upload
	const handleUpload = async () => {
		if (selectedFiles.length === 0) {
			toast.error('Please select at least one image');
			return;
		}

		// Validate alt texts
		const emptyAltTexts = altTexts.some(
			(alt, index) =>
				index < selectedFiles.length && (!alt || alt.trim().length === 0)
		);

		if (emptyAltTexts) {
			toast.error('Please provide alt text for all images');
			return;
		}

		uploadMutation.mutate(
			{
				files: selectedFiles,
				altTexts: altTexts.slice(0, selectedFiles.length),
			},
			{
				onSuccess: (data) => {
					setUploadedImages(data.images);
					setSelectedFiles([]);
					setAltTexts([]);
					setIsPreviewMode(false);
				},
			}
		);
	};

	// Clear all selections
	const handleClear = () => {
		setSelectedFiles([]);
		setAltTexts([]);
		setIsPreviewMode(false);
	};

	// Copy image URL to clipboard
	const copyToClipboard = async (url: string) => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success('Image URL copied to clipboard');
		} catch (error) {
			toast.error('Failed to copy URL');
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Upload Multiple Images
				</h1>
				<p className="text-gray-600">
					Upload multiple images at once and manage them efficiently
				</p>
			</div>

			{/* Upload Section */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Upload className="w-5 h-5" />
						Image Upload
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<MultipleImageUploader
						files={selectedFiles}
						onFilesChange={handleFilesChange}
						maxFiles={10}
						disabled={uploadMutation.isPending}
					/>

					{selectedFiles.length > 0 && (
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-semibold">
									Selected Images ({selectedFiles.length})
								</h3>
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() => setIsPreviewMode(!isPreviewMode)}
									>
										{isPreviewMode ? 'Hide Preview' : 'Show Preview'}
									</Button>
									<Button
										variant="outline"
										onClick={handleClear}
										disabled={uploadMutation.isPending}
									>
										Clear All
									</Button>
								</div>
							</div>

							{/* Alt Text Inputs */}
							<div className="grid gap-4">
								{selectedFiles.map((file, index) => (
									<div key={index} className="border rounded-lg p-4">
										<div className="flex items-start gap-4">
											{isPreviewMode && (
												<img
													src={URL.createObjectURL(file)}
													alt={`Preview ${index + 1}`}
													className="w-20 h-20 object-cover rounded-md"
												/>
											)}
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-2">
													<ImageIcon className="w-4 h-4 text-gray-500" />
													<span className="font-medium text-sm">
														{file.name}
													</span>
													<span className="text-xs text-gray-500">
														({(file.size / 1024 / 1024).toFixed(2)} MB)
													</span>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Alt Text <span className="text-red-500">*</span>
													</label>
													<input
														type="text"
														value={altTexts[index] || ''}
														onChange={(e) =>
															handleAltTextChange(index, e.target.value)
														}
														placeholder="Describe this image for accessibility"
														className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														disabled={uploadMutation.isPending}
													/>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>

							<Button
								onClick={handleUpload}
								disabled={
									uploadMutation.isPending || selectedFiles.length === 0
								}
								className="w-full"
								size="lg"
							>
								{uploadMutation.isPending ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
										Uploading {selectedFiles.length} images...
									</>
								) : (
									<>
										<Upload className="w-4 h-4 mr-2" />
										Upload {selectedFiles.length} Images
									</>
								)}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Upload Results */}
			{uploadedImages.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-600" />
							Successfully Uploaded Images ({uploadedImages.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{uploadedImages.map((image) => (
								<div key={image.id} className="border rounded-lg p-4 space-y-3">
									<img
										src={image.url}
										alt={image.alt}
										className="w-full h-32 object-cover rounded-md"
									/>
									<div className="space-y-2">
										<p className="font-medium text-sm truncate">
											{image.originalName}
										</p>
										<p className="text-xs text-gray-600 line-clamp-2">
											{image.alt}
										</p>
										<Button
											variant="outline"
											size="sm"
											onClick={() => copyToClipboard(image.url)}
											className="w-full"
										>
											Copy URL
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Error Display */}
			{uploadMutation.isError && (
				<Card className="border-red-200 bg-red-50">
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 text-red-600">
							<AlertCircle className="w-5 h-5" />
							<span className="font-medium">Upload Failed</span>
						</div>
						<p className="text-red-600 text-sm mt-1">
							{uploadMutation.error?.message ||
								'An error occurred during upload'}
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
