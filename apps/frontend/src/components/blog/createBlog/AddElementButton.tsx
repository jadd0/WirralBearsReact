import { Plus } from 'lucide-react';
import { Button } from '@components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@components/ui/dropdown-menu';
import { ElementType } from '@wirralbears/types';
import { ELEMENT_LABELS } from '@wirralbears/constants';

interface AddElementButtonProps {
  onAdd: (type: ElementType) => void;
}

export const AddElementButton = ({ onAdd }: AddElementButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full my-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Element
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onAdd('heading')}>
          {ELEMENT_LABELS.heading}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('paragraph')}>
          {ELEMENT_LABELS.paragraph}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('image')}>
          {ELEMENT_LABELS.image}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
