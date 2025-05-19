import { useState } from 'react';
import { BLOG_MAX_TITLE_LENGTH } from '../../../../../../packages/constants/src/blog.constants';
import { Input } from '@/components/ui/input';
import { HeadingElement } from '../../../../../../packages/types/src/blog.types';

/**
 * TitleHeadingElement component for the mandatory blog title
 */
export const TitleHeadingElement = ({
	element,
	onChange,
}: {
	element: HeadingElement;
	onChange: (id: string, text: string) => void;
}) => {
	const [error, setError] = useState<string | null>(null);
	const [isFocused, setIsFocused] = useState(false);

	const charCount = element.text.length;
	const maxLength = BLOG_MAX_TITLE_LENGTH;
	const charPercentage = (charCount / maxLength) * 100;
	const isNearLimit = charPercentage > 80;

	// Handle title input changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.length > maxLength) {
			setError(`Title must be ${maxLength} characters or less`);
		} else {
			setError(null);
			onChange(element.id, value);
		}
	};

	return (
		<div className="mb-8 border-b pb-6">
			<h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
				<span className="inline-block w-1.5 h-6 bg-blue-500 rounded-sm mr-2"></span>
				Blog Title
				<span className="ml-1 text-xs font-normal text-gray-500">
					(Required)
				</span>
			</h2>
			<div className="space-y-3">
				<Input
					className={`text-2xl font-bold transition-all py-6 ${
						isFocused ? 'border-blue-400 ring-2 ring-blue-100' : ''
					}`}
					value={element.text}
					onChange={handleChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder="Write an engaging title for your blog..."
					maxLength={maxLength}
					required
				/>
				{error && <p className="text-sm text-red-500 font-medium">{error}</p>}
				<div className="flex items-center gap-2">
					<div className="h-1.5 flex-grow bg-gray-100 rounded-full overflow-hidden">
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
		</div>
	);
};
