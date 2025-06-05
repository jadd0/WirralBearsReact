import { BlogData, BlogElement } from '@wirralbears/types';
import { FullBlog } from '@wirralbears/backend-types';

/**
 * Converts a FullBlog object into BlogData format for editing or display.
 * - Places the title as the first heading element.
 * - Orders headings, paragraphs, and images by their position.
 */
export function convertFullBlogToBlogData(fullBlog: FullBlog): BlogData {
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

	// Sort by position to maintain correct order
	allElements.sort((a, b) => a.position - b.position);

	// Convert to BlogElement format, adjusting positions after the title
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

	return { elements };
}
