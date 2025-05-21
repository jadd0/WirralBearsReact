import { z } from 'zod';
import { ELEMENT_CONSTRAINTS } from '@wirralbears/constants';

const headingSchema = z.object({
	id: z.string(),
	type: z.literal('heading'),
	text: z
		.string()
		.min(1, 'Heading cannot be empty')
		.max(
			ELEMENT_CONSTRAINTS.heading.maxLength,
			`Heading must be ${ELEMENT_CONSTRAINTS.heading.maxLength} characters or less`
		),
	position: z.number(),
});

const paragraphSchema = z.object({
	id: z.string(),
	type: z.literal('paragraph'),
	text: z
		.string()
		.min(1, 'Paragraph cannot be empty')
		.max(
			ELEMENT_CONSTRAINTS.paragraph.maxLength,
			`Paragraph must be ${ELEMENT_CONSTRAINTS.paragraph.maxLength} characters or less`
		),
	position: z.number(),
});

export const imageSchema = z.object({
	id: z.string(),
	type: z.literal('image'),
	alt: z.string().min(1, 'Image alt text cannot be empty'),
	url: z.string().optional(),
	file: z.any().optional(),
	localPreviewUrl: z.string().optional(),
	position: z.number(),
});

export const blogElementSchema = z.discriminatedUnion('type', [
	headingSchema,
	paragraphSchema,
	imageSchema,
]);

export const blogDataSchema = z.object({
	elements: z
		.array(blogElementSchema)
		.min(1, 'Blog must contain at least one element')
		.refine(
			(elements) =>
				elements.some(
					(el) =>
						el.type === 'heading' &&
						el.position === 0 &&
						el.text.trim().length > 0
				),
			{
				message: 'Blog must have a non-empty title',
			}
		),
});
