import { useLayoutEffect, useState } from 'react';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData } from '@wirralbears/types';
import { toast } from 'sonner';
import { api } from '@/api/api';
import { useNavigate } from 'react-router-dom';
import { useSaveBlog } from '@/hooks/blog.hooks';

export default function BlogMakerPage() {
	const [blogData, setBlogData] = useState<BlogData>({ elements: [] });
	const [initialData, setInitialData] = useState<BlogData>({ elements: [] });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const saveBlogMutation = useSaveBlog();
	const { mutate: saveBlog, isPending } = saveBlogMutation();

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
		// Save to localStorage for persistence
		localStorage.setItem('blog-editor-data', JSON.stringify(data));
	};

	// Image upload handler
	const handleImageUpload = async (file: File): Promise<string> => {
		return URL.createObjectURL(file);
	};

	// Handle save button click
	const handleSave = async (data: BlogData) => {
		setIsSubmitting(true);

		try {
			await saveBlog(data, {
				onSuccess: ({ id }) => {
					// Clear localStorage and navigate after successful save
					localStorage.removeItem('blog-editor-data');
					toast.success('Blog saved successfully!');
					navigate('/blogs');
				},
				onError: (error) => {
					toast.error('Failed to save blog', {
						description: error.message,
					});
				},
			});
		} catch (error) {
			console.error('Error saving blog:', error);
			toast.error('An unexpected error occurred');
		} finally {
			setIsSubmitting(false);
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
				onSave={handleSave}
			/>
		</div>
	);
}
