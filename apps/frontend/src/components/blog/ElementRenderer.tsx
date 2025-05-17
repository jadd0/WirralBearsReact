import { BlogElement } from '@wirralbears/types';
import { HeadingElement } from './createBlog/HeadingElement';
import { ParagraphElement } from './createBlog/ParagraphElement';
import { ImageElement } from './createBlog/ImageElement';

interface ElementRendererProps {
  element: BlogElement;
  onChange: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

export const ElementRenderer = ({ element, onChange, onDelete }: ElementRendererProps) => {
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
        <ImageElement 
          element={element} 
          onChange={onChange} 
          onDelete={onDelete} 
        />
      );
    default:
      return null;
  }
};
