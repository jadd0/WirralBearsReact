import { BlogElement } from '@wirralbears/types';
import { HeadingElement } from './createBlog/HeadingElement';
import { ParagraphElement } from './createBlog/ParagraphElement';
import { ImageUploadElement } from './createBlog/ImageElement';

interface ElementRendererProps {
  element: BlogElement;
  onChange: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

export const ElementRenderer = ({ element, onChange, onDelete, onImageUpload }: ElementRendererProps) => {
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
