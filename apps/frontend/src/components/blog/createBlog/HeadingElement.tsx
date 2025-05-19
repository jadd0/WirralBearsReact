import { useState } from 'react';
import { ElementWrapper } from './ElementWrapper';
import { Input } from '@components/ui/input';
import { HeadingElement as HeadingElementType } from '@wirralbears/types';
import { ELEMENT_CONSTRAINTS } from '@wirralbears/constants';

interface HeadingElementProps {
	element: HeadingElementType;
	onChange: (id: string, text: string) => void;
	onDelete: (id: string) => void;
}

export const HeadingElement = ({
	element,
	onChange,
	onDelete,
}: HeadingElementProps) => {
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.length > ELEMENT_CONSTRAINTS.heading.maxLength) {
			setError(
				`Heading must be ${ELEMENT_CONSTRAINTS.heading.maxLength} characters or less`
			);
		} else {
			setError(null);
			onChange(element.id, value);
		}
	};

	return (
		<ElementWrapper id={element.id} onDelete={() => onDelete(element.id)}>
			<div className="space-y-2">
				<Input
					className="text-xl font-bold"
					value={element.text}
					onChange={handleChange}
					placeholder="Heading"
					maxLength={ELEMENT_CONSTRAINTS.heading.maxLength}
				/>
				{error && <p className="text-sm text-red-500">{error}</p>}
				<p className="text-xs text-gray-400">
					{element.text.length}/{ELEMENT_CONSTRAINTS.heading.maxLength}
				</p>
			</div>
		</ElementWrapper>
	);
};
