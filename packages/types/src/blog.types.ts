export type ElementType = 'heading' | 'paragraph' | 'image';

export interface BaseElement {
	id: string;
	type: ElementType;
	position?: number;
}

export interface HeadingElement extends BaseElement {
	type: 'heading';
	text: string;
}

export interface ParagraphElement extends BaseElement {
	type: 'paragraph';
	text: string;
}

export interface ImageElement extends BaseElement {
	type: 'image';
	url: string;
	alt: string;
}

export type BlogElement = HeadingElement | ParagraphElement | ImageElement;

export interface BlogData {
	elements: BlogElement[];
}
