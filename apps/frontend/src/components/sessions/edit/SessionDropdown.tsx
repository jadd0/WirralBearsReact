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
				<Button variant="outline" className="min-w-[110px] text-gray-700">
					{id.startsWith('new-') && position == '' ? title : currentValue || position}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48">
				<DropdownMenuLabel>{title}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={currentValue}
					onValueChange={(val) => {
						setPosition(val);
						onClick?.(val);
					}}
				>
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
