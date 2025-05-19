import { useLayoutEffect, useState } from 'react';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData } from '@wirralbears/types';
import { toast } from 'sonner';

export default function BlogMakerPage() {
	const [blogData, setBlogData] = useState<BlogData>({ elements: [] });
	const [initialData, setInitialData] = useState<BlogData>({ elements: [] });

	// Load data from localStorage on component mount
	useLayoutEffect(() => {
		const storedData = localStorage.getItem('blog-editor-data');

		if (storedData) {
			try {
				const parsedData = JSON.parse(storedData);
				console.log({ parsedData });
				setInitialData(parsedData);
				setBlogData(parsedData); 
			} catch (error) {
				console.error('Failed to parse blog editor data:', error);
				toast.error('Failed to load saved blog data');
			}
		}
	}, []);

	const handleBlogChange = (data: BlogData) => {
		setBlogData(data);
		// Save to localStorage for preview
		localStorage.setItem('blog-preview-data', JSON.stringify(data));
	};

	// Image upload handler
	const handleImageUpload = async (file: File): Promise<string> => {
		try {
			// Create form data
			const formData = new FormData();
			formData.append('file', file);

			// Send the request to your API endpoint
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Failed to upload image');
			}

			const data = await response.json();
			return data.url;
		} catch (error) {
			console.error('Upload error:', error);
			toast.error('Failed to upload image');
			throw error;
		}
	};

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">Blog Maker</h1>
			<BlogEditor
				key={JSON.stringify(initialData)}
				initialData={initialData}
				onChange={handleBlogChange}
				onImageUpload={handleImageUpload}
			/>
		</div>
	);
}
