export type ElementType = 'heading' | 'paragraph' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
}

export interface HeadingElement extends BaseElement {
  type: 'heading';
  content: string;
}

export interface ParagraphElement extends BaseElement {
  type: 'paragraph';
  content: string;
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
