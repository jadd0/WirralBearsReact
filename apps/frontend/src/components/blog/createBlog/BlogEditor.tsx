import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

import { ElementType, BlogData, BlogElement } from '@wirralbears/types';
import { AddElementButton } from './AddElementButton';
import { HeadingElement } from './HeadingElement';
import { ParagraphElement } from './ParagraphElement';
import { ImageUploadElement } from './ImageElement';
import { TitleHeadingElement } from './TitleHeading';
import { HeadingElement as HeadingElementType } from '@wirralbears/types';
import { BLOG } from '@wirralbears/validation';

/**
 * Component to render different types of blog elements based on their type
 */
interface ElementRendererProps {
	element: BlogElement;
	onChange: (id: string, updates: any) => void;
	onDelete: (id: string) => void;
	onImageUpload: (file: File) => Promise<string>;
}

const ElementRenderer = ({
	element,
	onChange,
	onDelete,
	onImageUpload,
}: ElementRendererProps) => {
	switch (element.type) {
		case 'heading':
			return (
				<HeadingElement
					element={element}
					onChange={(id, text) => onChange(id, { text })}
					onDelete={onDelete}
				/>
			);
		case 'paragraph':
			return (
				<ParagraphElement
					element={element}
					onChange={(id, text) => onChange(id, { text })}
					onDelete={onDelete}
				/>
			);
		case 'image':
			return (
				<ImageUploadElement
					element={{
						...element,
						position: element.position ?? 0,
					}}
					onChange={onChange}
					onDelete={onDelete}
					onImageUpload={onImageUpload}
				/>
			);
		default:
			return null;
	}
};

/**
 * Interface for the main BlogEditor component props
 */
interface BlogEditorProps {
	initialData?: BlogData;
	onChange?: (data: BlogData) => void;
	onImageUpload: (file: File) => Promise<string>;
	onSave?: (data: BlogData) => void;
}

export const BlogEditor = ({
	initialData,
	onChange,
	onImageUpload,
	onSave,
}: BlogEditorProps) => {
	const form = useForm<BlogData>({
		resolver: zodResolver(BLOG.blogDataSchema),
		defaultValues: initialData || {
			elements: [createNewElement('heading', 0)],
		},
	});

	// Initialize with a title heading element if not provided
	const [elements, setElements] = useState<BlogElement[]>(() => {
		if (initialData?.elements && initialData.elements.length > 0) {
			// Check if there's already a heading element that can serve as title
			const hasTitle = initialData.elements.some(
				(el) => el.type === 'heading' && el.position === 0
			);

			if (hasTitle) {
				return initialData.elements;
			}

			// Add a title element at the beginning
			return [
				createNewElement('heading', 0), // Title element with position 0
				...initialData.elements,
			];
		}

		// Start with just a title element
		return [createNewElement('heading', 0)];
	});

	// Configure drag and drop sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3, // Minimum drag distance before activation
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	/**
	 * Handle the end of a drag operation to reorder elements
	 * Prevent the title element (position 0) from being moved
	 */
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		// Get the element being dragged
		const activeElement = elements.find((el) => el.id === active.id);

		// Don't allow dragging the title element (position 0)
		if (activeElement?.position === 0) {
			return;
		}

		if (over && active.id !== over.id) {
			setElements((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				// Don't allow elements to be moved before the title
				if (newIndex === 0) {
					return items;
				}

				const newElements = arrayMove(items, oldIndex, newIndex);

				// Update positions after reordering
				const updatedElements = newElements.map((el, idx) => ({
					...el,
					position: idx,
				}));

				validateAndNotify(updatedElements);
				return updatedElements;
			});
		}
	};

	/**
	 * Add a new element to the blog content
	 */
	const addElement = (type: ElementType) => {
		// New elements are added at the end with appropriate position
		const position = elements.length;
		const newElement = createNewElement(type, position);
		const newElements = [...elements, newElement];
		setElements(newElements);
		validateAndNotify(newElements);
	};

	/**
	 * Update an existing element in the blog content
	 */
	const updateElement = (id: string, updates: Partial<BlogElement>) => {
		const newElements = elements.map((element) =>
			element.id === id ? { ...element, ...updates } : element
		);
		setElements(newElements);
		validateAndNotify(newElements);
	};

	/**
	 * Delete an element from the blog content
	 * Prevent deletion of the title element
	 */
	const deleteElement = (id: string) => {
		// Find the element to be deleted
		const elementToDelete = elements.find((el) => el.id === id);

		// Don't allow deleting the title element (position 0)
		if (elementToDelete?.position === 0) {
			toast.error('Cannot delete title', {
				description: 'The blog title is required and cannot be removed',
			});
			return;
		}

		const newElements = elements.filter((element) => element.id !== id);

		// Update positions after deletion
		const updatedElements = newElements.map((el, idx) => ({
			...el,
			position: idx,
		}));

		setElements(updatedElements);
		validateAndNotify(updatedElements);

		toast.success('Element deleted', {
			description: 'The element has been removed from your blog',
		});
	};

	/**
	 * Update the blog title element
	 */
	const updateTitle = (id: string, text: string) => {
		updateElement(id, { text });
	};

	/**
	 * Validate the blog content and notify parent component of changes
	 */
	const validateAndNotify = (blogElements: BlogElement[]) => {
		try {
			// Create complete blog data with elements
			const blogData: BlogData = { elements: blogElements };
			const result = BLOG.blogDataSchema.parse(blogData);

			// Update form values
			form.setValue('elements', blogElements);

			// Notify parent component of valid changes
			if (onChange) {
				onChange(result);
			}
		} catch (error: any) {
			if (error.errors) {
				// Only show one toast with all errors
				const errorMessages = error.errors
					.map((err: any) => err.message)
					.join('\n');

				if (errorMessages == 'Please provide a valid image URL') return;
				toast.error('Validation Error', {
					description: errorMessages,
				});
			}
		}
	};

	// Update form when elements change
	useEffect(() => {
		form.setValue('elements', elements);
	}, [elements, form]);

	// Update editor when initialData changes
	useEffect(() => {
		if (initialData?.elements && initialData.elements.length > 0) {
			// Check if there's already a heading element that can serve as title
			const hasTitle = initialData.elements.some(
				(el) => el.type === 'heading' && el.position === 0
			);

			if (hasTitle) {
				setElements(initialData.elements);
			} else {
				// Add a title element at the beginning
				setElements([
					createNewElement('heading', 0), // Title element with position 0
					...initialData.elements.map((el, idx) => ({
						...el,
						position: idx + 1,
					})),
				]);
			}
		}
	}, [initialData]);

	// Handle save
	const handleSave = useCallback(() => {
		// Validate non-empty content before saving
		const emptyHeadings = elements.filter(
			(el) => el.type === 'heading' && el.text.trim().length === 0
		);

		const emptyParagraphs = elements.filter(
			(el) => el.type === 'paragraph' && el.text.trim().length === 0
		);

		// Validate title specifically
		const title = elements.find(
			(el) => el.type === 'heading' && el.position === 0
		);
		if (!title || title.text.trim().length === 0) {
			toast.error('Cannot save blog', {
				description:
					'Blog title cannot be empty. Please add a title to your blog.',
			});
			return;
		}

		if (emptyHeadings.length > 0) {
			toast.error('Cannot save blog', {
				description:
					'One or more headings are empty. Please add content to all headings or remove them.',
			});
			return;
		}

		if (emptyParagraphs.length > 0) {
			toast.error('Cannot save blog', {
				description:
					'One or more paragraphs are empty. Please add content to all paragraphs or remove them.',
			});
			return;
		}

		// Validate images
		const invalidImages = elements.filter(
			(el) =>
				el.type === 'image' &&
				!(el.url || el.localPreviewUrl) &&
				!(el.alt && el.alt.trim().length > 0)
		);

		if (invalidImages.length > 0) {
			toast.error('Cannot save blog', {
				description:
					'One or more images are invalid. Please ensure all images have content and alt text.',
			});
			return;
		}

		if (onSave) {
			onSave({ elements });
		}
	}, [elements, onSave]);

	// Submit handler
	const onSubmit: SubmitHandler<BlogData> = (data) => {
		if (onChange) {
			onChange(data);
		}
	};

	// Get the title element (first heading with position 0)
	const titleElement = elements.find(
		(el) => el.type === 'heading' && el.position === 0
	) as HeadingElementType | undefined;

	// Get content elements (everything except the title)
	const contentElements = elements.filter((el) => el.position !== 0);

	return (
		<div className="max-w-4xl mx-auto p-4">
			<form onSubmit={form.handleSubmit(onSubmit)}>
				{/* Mandatory title heading component */}
				{titleElement && (
					<Controller
						control={form.control}
						name={`elements.${elements.findIndex(
							(el) => el.id === titleElement.id
						)}.text`}
						render={({ field }) => (
							<TitleHeadingElement
								element={titleElement}
								onChange={(id, text) => {
									field.onChange(text);
									updateTitle(id, text);
								}}
							/>
						)}
					/>
				)}

				{/* Drag and drop context for blog elements */}
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={contentElements.map((el) => el.id)}
						strategy={verticalListSortingStrategy}
					>
						{contentElements.length === 0 ? (
							<div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-md">
								<p className="text-gray-500">
									Your blog is empty. Add elements to get started.
								</p>
							</div>
						) : (
							contentElements.map((element) => (
								<Controller
									key={element.id}
									control={form.control}
									name={`elements.${elements.findIndex(
										(el) => el.id === element.id
									)}`}
									render={({ field }) => (
										<ElementRenderer
											element={element}
											onChange={(id, updates) => {
												updateElement(id, updates);
												// Update the specific field in the form
												const elementIndex = elements.findIndex(
													(el) => el.id === id
												);
												if (elementIndex !== -1) {
													const updatedElement = {
														...elements[elementIndex],
														...updates,
													};
													field.onChange(updatedElement);
												}
											}}
											onDelete={deleteElement}
											onImageUpload={onImageUpload}
										/>
									)}
								/>
							))
						)}
					</SortableContext>
				</DndContext>

				{/* Controls for adding elements and saving */}
				<AddElementButton onAdd={addElement} />
				<div className="flex justify-end mt-4 space-x-4">
					<Button onClick={handleSave} type="button">
						<Save className="mr-2 h-4 w-4" />
						Save Blog
					</Button>
				</div>
			</form>
		</div>
	);
};

/**
 * Create a new blog element based on its type
 */
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
