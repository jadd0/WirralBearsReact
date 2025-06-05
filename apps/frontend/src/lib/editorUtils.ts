// @/lib/editorUtils.ts

import { v4 as uuidv4 } from 'uuid';
import { BlogData, BlogElement, ElementType } from '@wirralbears/types';
import { FullBlog } from '@wirralbears/backend-types';

/**
 * Converts a FullBlog object (from API) into BlogData format for the editor.
 * This is used for both blog and coach content, as their structures are similar.
 *
 * @param fullBlog - The FullBlog object fetched from the backend.
 * @returns BlogData - The data structure used by the BlogEditor.
 */
export function convertFullBlogToBlogData(fullBlog: FullBlog): BlogData {
	if (!fullBlog) {
		return { elements: [] };
	}

	const elements: BlogElement[] = [];

	// Add the blog or coach title as the first element if available.
	if (fullBlog.title) {
		elements.push({
			id: 'title',
			type: 'heading',
			text: fullBlog.title,
			position: 0,
		});
	}

	// Collect all elements (headings, paragraphs, images) with their positions.
	const allElements: Array<{
		id: string;
		type: 'heading' | 'paragraph' | 'image';
		position: number;
		data: any;
	}> = [];

	// Add headings, skipping the title if it appears in headings.
	if (fullBlog.headings && fullBlog.headings.length > 0) {
		fullBlog.headings.forEach((heading) => {
			if (heading.text === fullBlog.title) {
				return; // Skip if this heading is the same as the title.
			}
			allElements.push({
				id: heading.id,
				type: 'heading',
				position: heading.position,
				data: heading,
			});
		});
	}

	// Add paragraphs.
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

	// Add images.
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

	// Sort all elements by their position to maintain correct order.
	allElements.sort((a, b) => a.position - b.position);

	// Convert to BlogElement format, adjusting positions so that title is always first.
	allElements.forEach((element, index) => {
		const adjustedPosition = index + 1; // Content starts at position 1 (title is 0)
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

/**
 * Creates a new empty editor element of the specified type.
 * Used by the BlogEditor when adding new content blocks.
 *
 * @param type - The type of element to create ('heading', 'paragraph', 'image').
 * @param position - The position/index for the new element.
 * @returns BlogElement - The new, empty element.
 */
export function createNewElement(
	type: ElementType,
	position: number
): BlogElement {
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
