import { useEffect, useState } from 'react';
import { BlogPreview } from '@/components/blog/preview/BlogPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BlogData } from '@wirralbears/types';
import { useSaveBlog } from '@/hooks/blog.hooks';

export default function PreviewPage() {
	const navigate = useNavigate();
	const [blogData, setBlogData] = useState<BlogData | null>(null);
	const saveBlogMutation = useSaveBlog();
	const { mutate: saveBlog, isPending } = saveBlogMutation();

	useEffect(() => {
		// Retrieve the blog data from localStorage
		const storedData = localStorage.getItem('blog-preview-data');
		if (storedData) {
			try {
				const parsedData = JSON.parse(storedData);
				setBlogData(parsedData);
			} catch (error) {
				console.error('Failed to parse blog data:', error);
			}
		}
	}, []);

	const handleBack = () => {
		// When going back to the editor, store the current blog data
		// in a different localStorage key that the BlogEditor will check
		if (blogData) {
			localStorage.setItem('blog-editor-data', JSON.stringify(blogData));
		}
		navigate('/admin/blog/createPost'); // Navigate to the editor page
	};

	const handleSave = () => {
		if (blogData) {
			saveBlog(blogData, {
				onSuccess: ({ id }) => {
					// Navigate to the blogs list or dashboard after saving
					localStorage.removeItem('blog-preview-data');
					localStorage.removeItem('blog-editor-data'); // Also clear editor data
					navigate('/blogs');
				},
			});
		}
	};

	if (!blogData) {
		return (
			<div className="max-w-4xl mx-auto p-8 text-center">
				<h1 className="text-2xl font-bold mb-4">No Preview Data</h1>
				<p className="text-gray-500 mb-6">No blog data found to preview.</p>
				<Button onClick={() => navigate('/blog/edit')}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Editor
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-8">
				<Button variant="outline" onClick={handleBack}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Editor
				</Button>
				<Button onClick={handleSave} disabled={isPending}>
					{isPending ? (
						<>
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4"
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
							Saving...
						</>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" />
							Save Blog
						</>
					)}
				</Button>
			</div>

			<div className="bg-white rounded-lg shadow-lg overflow-hidden">
				<div className="p-6">
					<h1 className="text-3xl font-bold mb-6 text-center">Blog Preview</h1>
					<div className="border-t pt-6">
						<BlogPreview data={blogData} />
					</div>
				</div>
			</div>
		</div>
	);
}
