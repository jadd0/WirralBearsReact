import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface ElementWrapperProps {
  id: string;
  children: React.ReactNode;
  onDelete?: () => void;
}

export const ElementWrapper = ({ id, children, onDelete }: ElementWrapperProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="mb-4 relative group"
    >
      <div 
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab p-2 text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </div>
      <CardContent className="p-4 pl-10">
        {children}
      </CardContent>
    </Card>
  );
};
