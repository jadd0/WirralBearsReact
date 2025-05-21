import { z } from 'zod';
import { ELEMENT_CONSTRAINTS } from '@wirralbears/constants';

const headingSchema = z.object({
	id: z.string(),
	type: z.literal('heading'),
	text: z
		.string()
		.max(
			ELEMENT_CONSTRAINTS.heading.maxLength,
			`Heading must be ${ELEMENT_CONSTRAINTS.heading.maxLength} characters or less`
		),
});

const paragraphSchema = z.object({
	id: z.string(),
	type: z.literal('paragraph'),
	text: z
		.string()
		.max(
			ELEMENT_CONSTRAINTS.paragraph.maxLength,
			`Paragraph must be ${ELEMENT_CONSTRAINTS.paragraph.maxLength} characters or less`
		),
});

export const imageSchema = z.object({
	id: z.string(),
	type: z.literal('image'),
	alt: z.string(),
});

export const blogElementSchema = z.discriminatedUnion('type', [
	headingSchema,
	paragraphSchema,
	imageSchema,
]);

export const blogDataSchema = z.object({
	elements: z.array(blogElementSchema),
});
