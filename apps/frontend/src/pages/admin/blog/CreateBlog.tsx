import { useLayoutEffect, useState } from 'react';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData } from '@wirralbears/types';
import { toast } from 'sonner';
import { api } from '@/api/api';
import { useNavigate } from 'react-router-dom';

export default function BlogMakerPage() {
	const [blogData, setBlogData] = useState<BlogData>({ elements: [] });
	const [initialData, setInitialData] = useState<BlogData>({ elements: [] });
	const navigate = useNavigate();

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
			// Use the blog API service to upload the image
			const result = await api.blog.uploadImage(file);
			return result;
		} catch (error) {
			console.error('Upload error:', error);
			toast.error('Failed to upload image', {
				description: 'Please try again or use a different image.',
			});
			throw error;
		}
	};

	// Handle preview button click (if needed)
	const handlePreview = () => {
		navigate('/admin/blog/preview');
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
