import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export function SessionDropdown({
	title,
	values,
	onClick,
	currentValue,
	id,
}: {
	title?: string;
	values?: any[];
	onClick?: (value: any) => void;
	currentValue?: any;
	id: any;
}) {
	const [position, setPosition] = useState('');

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{id === '' && position == '' ? title : currentValue || position}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{title}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
					{values?.map((value) => (
						<DropdownMenuRadioItem
							key={value}
							value={value}
							onClick={() => onClick?.(value)}
						>
							{value}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
