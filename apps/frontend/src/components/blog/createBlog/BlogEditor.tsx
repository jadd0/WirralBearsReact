import { useState } from 'react';
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
import { z } from 'zod';
import { toast } from 'sonner';

import { ElementType, BlogData, BlogElement } from '@wirralbears/types';
import { ELEMENT_CONSTRAINTS } from '@wirralbears/constants';
import { AddElementButton } from './AddElementButton';
import { PreviewButton } from './PreviewButton';
import { HeadingElement } from './HeadingElement';
import { ParagraphElement } from './ParagraphElement';
import { ImageElement } from './ImageElement';

// Define validation schemas
const headingSchema = z.object({
	id: z.string(),
	type: z.literal('heading'),
	content: z
		.string()
		.max(
			ELEMENT_CONSTRAINTS.heading.maxLength,
			`Heading must be ${ELEMENT_CONSTRAINTS.heading.maxLength} characters or less`
		),
});

const paragraphSchema = z.object({
	id: z.string(),
	type: z.literal('paragraph'),
	content: z
		.string()
		.max(
			ELEMENT_CONSTRAINTS.paragraph.maxLength,
			`Paragraph must be ${ELEMENT_CONSTRAINTS.paragraph.maxLength} characters or less`
		),
});

const imageSchema = z.object({
	id: z.string(),
	type: z.literal('image'),
	url: z.string().url('Please provide a valid image URL'),
	alt: z.string(),
});

const blogElementSchema = z.discriminatedUnion('type', [
	headingSchema,
	paragraphSchema,
	imageSchema,
]);

const blogDataSchema = z.object({
	elements: z.array(blogElementSchema),
});

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
					onChange={(id, content) => onChange(id, { content })}
					onDelete={onDelete}
				/>
			);
		case 'paragraph':
			return (
				<ParagraphElement
					element={element}
					onChange={(id, content) => onChange(id, { content })}
					onDelete={onDelete}
				/>
			);
		case 'image':
			return (
				<ImageElement
					element={element}
					onChange={onChange}
					onDelete={onDelete}
					onImageUpload={onImageUpload}
				/>
			);
		default:
			return null;
	}
};

interface BlogEditorProps {
	initialData?: BlogData;
	onChange?: (data: BlogData) => void;
	onImageUpload: (file: File) => Promise<string>;
}

export const BlogEditor = ({
	initialData,
	onChange,
	onImageUpload,
}: BlogEditorProps) => {
	const [elements, setElements] = useState<BlogElement[]>(
		initialData?.elements || []
	);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setElements((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				const newElements = arrayMove(items, oldIndex, newIndex);
				validateAndNotify(newElements);
				return newElements;
			});
		}
	};

	const addElement = (type: ElementType) => {
		const newElement: BlogElement = createNewElement(type);
		const newElements = [...elements, newElement];
		setElements(newElements);
		validateAndNotify(newElements);
	};

	const updateElement = (id: string, updates: Partial<BlogElement>) => {
		const newElements = elements.map((element) =>
			element.id === id ? { ...element, ...updates } : element
		);
		setElements(newElements);
		validateAndNotify(newElements);
	};

	const deleteElement = (id: string) => {
		const newElements = elements.filter((element) => element.id !== id);
		setElements(newElements);
		validateAndNotify(newElements);

		toast.success('Element deleted', {
			description: 'The element has been removed from your blog',
		});
	};

	const validateAndNotify = (elements: BlogElement[]) => {
		try {
			const result = blogDataSchema.parse({ elements });
			if (onChange) {
				onChange(result);
			}
		} catch (error: any) {
			if (error.errors) {
				// Only show one toast with all errors
				const errorMessages = error.errors
					.map((err: any) => err.message)
					.join('\n');
				toast.error('Validation Error', {
					description: errorMessages,
				});
			}
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={elements.map((el) => el.id)}
					strategy={verticalListSortingStrategy}
				>
					{elements.length === 0 ? (
						<div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-md">
							<p className="text-gray-500">
								Your blog is empty. Add elements to get started.
							</p>
						</div>
					) : (
						elements.map((element) => (
							<ElementRenderer
								key={element.id}
								element={element}
								onChange={updateElement}
								onDelete={deleteElement}
								onImageUpload={onImageUpload}
							/>
						))
					)}
				</SortableContext>
			</DndContext>

			<AddElementButton onAdd={addElement} />
			<div className="flex justify-end mt-4 space-x-4">
				<PreviewButton blogData={{ elements }} />
			</div>
		</div>
	);
};

function createNewElement(type: ElementType): BlogElement {
	const id = uuidv4();

	switch (type) {
		case 'heading':
			return { id, type, content: '' };
		case 'paragraph':
			return { id, type, content: '' };
		case 'image':
			return { id, type, url: '', alt: '' };
		default:
			throw new Error(`Unknown element type: ${type}`);
	}
}
