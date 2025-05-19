import { useState } from 'react';
import { ElementWrapper } from './ElementWrapper';
import { Textarea } from '@components/ui/textarea';
import { ParagraphElement as ParagraphElementType } from '@wirralbears/types';
import { ELEMENT_CONSTRAINTS } from '@wirralbears/constants';

interface ParagraphElementProps {
	element: ParagraphElementType;
	onChange: (id: string, text: string) => void;
	onDelete: (id: string) => void;
}

export const ParagraphElement = ({
	element,
	onChange,
	onDelete,
}: ParagraphElementProps) => {
	const [error, setError] = useState<string | null>(null);
	const [isFocused, setIsFocused] = useState(false);

	const charCount = element.text.length;
	const maxLength = ELEMENT_CONSTRAINTS.paragraph.maxLength;
	const charPercentage = (charCount / maxLength) * 100;
	const isNearLimit = charPercentage > 90;

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		if (value.length > maxLength) {
			setError(`Paragraph must be ${maxLength} characters or less`);
		} else {
			setError(null);
			onChange(element.id, value);
		}
	};

	return (
		<ElementWrapper id={element.id} onDelete={() => onDelete(element.id)}>
			<div className="space-y-2">
				<Textarea
					value={element.text}
					onChange={handleChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder="Write your story here..."
					className={`min-h-[120px] resize-y transition-all leading-relaxed ${
						isFocused ? 'border-blue-400 ring-2 ring-blue-100' : ''
					}`}
					maxLength={maxLength}
				/>
				{error && <p className="text-sm text-red-500 font-medium">{error}</p>}
				<div className="flex items-center gap-2">
					<div className="h-1 flex-grow bg-gray-100 rounded-full overflow-hidden">
						<div
							className={`h-full transition-all ${
								isNearLimit ? 'bg-amber-400' : 'bg-blue-400'
							}`}
							style={{ width: `${charPercentage}%` }}
						></div>
					</div>
					<p
						className={`text-xs ${
							isNearLimit ? 'text-amber-600 font-medium' : 'text-gray-400'
						}`}
					>
						{charCount}/{maxLength}
					</p>
				</div>
			</div>
		</ElementWrapper>
	);
};
