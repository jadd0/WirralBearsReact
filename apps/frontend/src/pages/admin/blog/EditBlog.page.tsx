import { useLayoutEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData, BlogElement, ElementType } from '@wirralbears/types';
import { FullBlog } from '@wirralbears/backend-types';
import { toast } from 'sonner';
import { useGetBlog, useEditBlog } from '@/hooks/blog.hooks';

export default function BlogEditPage() {
	const location = useLocation();
	const { id } = useParams();
	const navigate = useNavigate();
	const [blogData, setBlogData] = useState<BlogData>({ elements: [] });
	const [initialData, setInitialData] = useState<BlogData>({ elements: [] });
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Get blog data from API if not passed through state
	const { data: fetchedBlog, isLoading } = useGetBlog(id ?? '');

	const editBlogMutation = useEditBlog();
	const { mutate: editBlog, isPending } = editBlogMutation();

	console.log(fetchedBlog);

	// Load data from location state or API
	useLayoutEffect(() => {
		console.log('BlogEditPage useLayoutEffect triggered');
		console.log('Location state:', location.state);
		console.log('Fetched blog:', fetchedBlog);
		console.log('Is loading:', isLoading);

		// First check if data was passed through navigation state
		if (location.state?.blogData) {
			console.log('Using data from location state');
			const passedData = location.state.blogData as BlogData;
			setInitialData(passedData);
			setBlogData(passedData);
		} else if (fetchedBlog && !isLoading) {
			console.log('Converting fetched blog data');
			// Convert fetched blog to BlogData format
			const convertedData = convertFullBlogToBlogData(fetchedBlog as FullBlog);
			console.log('Converted data:', convertedData);
			setInitialData(convertedData);
			setBlogData(convertedData);
		}
	}, [location.state, fetchedBlog, isLoading]);

	const handleBlogChange = (data: BlogData) => {
		setBlogData(data);
		// Save to localStorage for persistence
		localStorage.setItem(`blog-editor-data-${id}`, JSON.stringify(data));
	};

	// Image upload handler
	const handleImageUpload = async (file: File): Promise<string> => {
		return URL.createObjectURL(file);
	};

	// Handle save button click
	const handleSave = async (data: BlogData) => {
		setIsSubmitting(true);

		try {
			await editBlog(
				{ blogData: data, id: id! },
				{
					onSuccess: () => {
						localStorage.removeItem(`blog-editor-data-${id}`);
						toast.success('Blog updated successfully!');
						navigate(`/blog/${id}`);
					},
					onError: (error: any) => {
						toast.error('Failed to update blog', {
							description: error.message,
						});
					},
				}
			);
		} catch (error) {
			console.error('Error updating blog:', error);
			toast.error('An unexpected error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<div className="text-center">Loading blog data...</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">Edit Blog</h1>
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

function convertFullBlogToBlogData(fullBlog: FullBlog): BlogData {
	console.log('Converting FullBlog:', fullBlog);

	if (!fullBlog) {
		return { elements: [] };
	}

	const elements: BlogElement[] = [];

	// Add title as first element (position 0)
	if (fullBlog.title) {
		elements.push({
			id: 'title',
			type: 'heading',
			text: fullBlog.title,
			position: 0,
		});
	}

	console.log('FullBlog headings:', fullBlog.headings);
	console.log('FullBlog paragraphs:', fullBlog.paragraphs);
	console.log('FullBlog images:', fullBlog.images);

	// Collect all elements with their positions
	const allElements: Array<{
		id: string;
		type: 'heading' | 'paragraph' | 'image';
		position: number;
		data: any;
	}> = [];

	// Add headings (skip title if it exists in headings)
	if (fullBlog.headings && fullBlog.headings.length > 0) {
		fullBlog.headings.forEach((heading) => {
			// Skip if this heading is the title
			if (heading.text === fullBlog.title) {
				return;
			}

			allElements.push({
				id: heading.id,
				type: 'heading',
				position: heading.position,
				data: heading,
			});
		});
	}

	// Add paragraphs
	if (fullBlog.paragraphs && fullBlog.paragraphs.length > 0) {
		fullBlog.paragraphs.forEach((paragraph) => {
			allElements.push({
				id: paragraph.id,
				type: 'paragraph',
				position: paragraph.position,
				data: paragraph,
			});
		});
	}

	// Add images
	if (fullBlog.images && fullBlog.images.length > 0) {
		fullBlog.images.forEach((image) => {
			allElements.push({
				id: image.id || `image-${image.position}`,
				type: 'image',
				position: image.position,
				data: image,
			});
		});
	}

	console.log('All collected elements before sorting:', allElements);

	// Sort by position to maintain correct order
	allElements.sort((a, b) => a.position - b.position);

	// Convert to BlogElement format
	allElements.forEach((element, index) => {
		const adjustedPosition = index + 1; // Start content at position 1

		switch (element.type) {
			case 'heading':
				elements.push({
					id: element.id,
					type: 'heading',
					text: element.data.text,
					position: adjustedPosition,
				});
				break;
			case 'paragraph':
				elements.push({
					id: element.id,
					type: 'paragraph',
					text: element.data.text,
					position: adjustedPosition,
				});
				break;
			case 'image':
				elements.push({
					id: element.id,
					type: 'image',
					url: element.data.url || '',
					alt: element.data.alt || '',
					position: adjustedPosition,
				});
				break;
		}
	});

	console.log('Final converted elements:', elements);
	return { elements };
}

// Helper function to create new elements (from BlogEditor)
function createNewElement(type: ElementType, position: number): BlogElement {
	const id = uuidv4();

	switch (type) {
		case 'heading':
			return { id, type, text: '', position };
		case 'paragraph':
			return { id, type, text: '', position };
		case 'image':
			return { id, type, url: '', alt: '', position };
		default:
			throw new Error(`Unknown element type: ${type}`);
	}
}
