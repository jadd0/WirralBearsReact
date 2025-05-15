// components/blog/ParagraphElement.tsx
import { useState } from 'react';
import { ElementWrapper } from './ElementWrapper';
import { Textarea } from '@components/ui/textarea';
import { ParagraphElement as ParagraphElementType } from '@wirralbears/types';
import { ELEMENT_CONSTRAINTS } from '@wirralbears/constants';

interface ParagraphElementProps {
  element: ParagraphElementType;
  onChange: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const ParagraphElement = ({ element, onChange, onDelete }: ParagraphElementProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > ELEMENT_CONSTRAINTS.paragraph.maxLength) {
      setError(`Paragraph must be ${ELEMENT_CONSTRAINTS.paragraph.maxLength} characters or less`);
    } else {
      setError(null);
      onChange(element.id, value);
    }
  };

  return (
    <ElementWrapper id={element.id} onDelete={() => onDelete(element.id)}>
      <div className="space-y-2">
        <Textarea
          value={element.content}
          onChange={handleChange}
          placeholder="Write your paragraph here..."
          className="min-h-[100px] resize-y"
          maxLength={ELEMENT_CONSTRAINTS.paragraph.maxLength}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-xs text-gray-400">
          {element.content.length}/{ELEMENT_CONSTRAINTS.paragraph.maxLength}
        </p>
      </div>
    </ElementWrapper>
  );
};
