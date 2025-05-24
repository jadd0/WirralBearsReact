import { useParams, useNavigate } from 'react-router-dom';
import { useGetBlog } from '@/hooks/blog.hooks';
import { toast } from 'sonner';
import { FullBlog } from '@wirralbears/backend-types';
import BlogHeader from './BlogHeader';
import BlogContent from './BlogContent';
import BlogSkeleton from './BlogSkeleton';
import { useMe } from '@/hooks/auth.hooks';

export default function BlogDisplay({ id }: { id: string }) {
	const { data, isLoading, error } = useGetBlog(id);
	const blogData = data as FullBlog;
	const navigate = useNavigate();
	const { data: auth } = useMe();

	if (auth?.authenticated) {
		console.log('admin!');
	}

	if (error) {
		toast.error('Failed to load blog post. Please try again later.');
	}

	const handleEditClick = () => {
		console.log('Original blogData:', blogData);

		// Convert blogData to BlogData format and pass through state
		const convertedData = convertFullBlogToBlogData(blogData);

		console.log('Converted data being passed:', convertedData);

		navigate(`/admin/blog/edit/${id}`, {
			state: { blogData: convertedData },
		});
	};

	return (
		<main className="w-full">
			<div
				className="w-full pl-[60px] pr-4 py-8"
				style={{ marginLeft: 0, marginRight: 'auto' }}
			>
				{auth?.authenticated && blogData && (
					<div className="mb-4">
						<button
							onClick={handleEditClick}
							className="text-blue-500 hover:underline cursor-pointer"
						>
							Edit Blog Post
						</button>
					</div>
				)}
				<div className="flex flex-col gap-4 w-full">
					{isLoading ? (
						<BlogSkeleton />
					) : blogData ? (
						<>
							<BlogHeader
								title={blogData.title}
								author={blogData.author}
								createdAt={blogData.createdAt}
							/>
							<BlogContent
								headings={blogData.headings}
								paragraphs={blogData.paragraphs}
								images={blogData.images}
							/>
						</>
					) : (
						<p>Blog post not found.</p>
					)}
				</div>
			</div>
		</main>
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
			position: 0
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
				data: heading
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
				data: paragraph
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
				data: image
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
					position: adjustedPosition
				});
				break;
			case 'paragraph':
				elements.push({
					id: element.id,
					type: 'paragraph',
					text: element.data.text,
					position: adjustedPosition
				});
				break;
			case 'image':
				elements.push({
					id: element.id,
					type: 'image',
					url: element.data.url || '',
					alt: element.data.alt || '',
					position: adjustedPosition
				});
				break;
		}
	});
	
	console.log('Final converted elements:', elements);
	return { elements };
}

