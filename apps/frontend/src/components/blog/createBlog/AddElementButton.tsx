import { Plus, Type, Pilcrow, ImageIcon } from 'lucide-react';
import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuLabel,
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
				<Button
					variant="outline"
					className="w-full my-6 py-6 border-dashed border-2 hover:border-solid transition-all group"
				>
					<Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
					<span className="font-medium">Add Content Block</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Choose content type</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={() => onAdd('heading')}
					className="flex items-center gap-2 cursor-pointer py-3"
				>
					<Type className="h-4 w-4" />
					<span>{ELEMENT_LABELS.heading}</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onAdd('paragraph')}
					className="flex items-center gap-2 cursor-pointer py-3"
				>
					<Pilcrow className="h-4 w-4" />
					<span>{ELEMENT_LABELS.paragraph}</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onAdd('image')}
					className="flex items-center gap-2 cursor-pointer py-3"
				>
					<ImageIcon className="h-4 w-4" />
					<span>{ELEMENT_LABELS.image}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
