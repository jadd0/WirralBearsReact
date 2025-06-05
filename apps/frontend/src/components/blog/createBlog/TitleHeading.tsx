import { useState } from 'react';
import { BLOG_MAX_TITLE_LENGTH } from '@wirralbears/constants';
import { Input } from '@/components/ui/input';
import { HeadingElement } from '../../../../../../packages/types/src/blog.types';

export const TitleHeadingElement = ({
	element,
	onChange,
	coach,
}: {
	element: HeadingElement;
	onChange: (id: string, text: string) => void;
	coach?: boolean;
}) => {
	const [error, setError] = useState<string | null>(null);
	const [isFocused, setIsFocused] = useState(false);

	const charCount = element.text.length;
	const maxLength = BLOG_MAX_TITLE_LENGTH;
	const charPercentage = (charCount / maxLength) * 100;
	const isNearLimit = charPercentage > 80;
	const isEmpty = charCount === 0;

	// Handle title input changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.length > maxLength) {
			setError(`${coach ? "Coach name" : "Title"} must be ${maxLength} characters or less`);
		} else if (value.trim().length === 0) {
			setError(`${coach ? "Coach name" : "Title"} cannot be empty`);
		} else {
			setError(null);
		}
		onChange(element.id, value);
	};

	// Handle blur to validate empty title
	const handleBlur = () => {
		setIsFocused(false);
		if (element.text.trim().length === 0) {
			setError(`${coach ? "Coach name" : "Title"} cannot be empty`);
		}
	};

	return (
		<div className="mb-8 border-b pb-6">
			<h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
				<span className="inline-block w-1.5 h-6 bg-blue-500 rounded-sm mr-2"></span>
				{coach ? 'Coach Name' : 'Blog Title'}
				<span className="ml-1 text-xs font-normal text-gray-500">
					(Required)
				</span>
			</h2>
			<div className="space-y-3">
				<Input
					className={`text-2xl font-bold transition-all py-6 ${
						isFocused ? 'border-blue-400 ring-2 ring-blue-100' : ''
					} ${isEmpty ? 'border-red-300' : ''}`}
					value={element.text}
					onChange={handleChange}
					onFocus={() => setIsFocused(true)}
					onBlur={handleBlur}
					placeholder={coach? 'Enter coach name' : "Write an engaging title for your blog..."}
					maxLength={maxLength}
					required
				/>
				{error && <p className="text-sm text-red-500 font-medium">{error}</p>}
				<div className="flex items-center gap-2">
					<div className="h-1.5 flex-grow bg-gray-100 rounded-full overflow-hidden">
						<div
							className={`h-full transition-all ${
								isEmpty
									? 'bg-red-400'
									: isNearLimit
									? 'bg-amber-400'
									: 'bg-blue-400'
							}`}
							style={{ width: `${isEmpty ? 100 : charPercentage}%` }}
						></div>
					</div>
					<p
						className={`text-xs ${
							isEmpty
								? 'text-red-600 font-medium'
								: isNearLimit
								? 'text-amber-600 font-medium'
								: 'text-gray-400'
						}`}
					>
						{charCount}/{maxLength}
					</p>
				</div>
			</div>
		</div>
	);
};
