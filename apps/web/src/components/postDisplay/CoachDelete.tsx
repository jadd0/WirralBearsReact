'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { useDeleteCoach } from '@/hooks/coach.hooks';

export default function CoachDelete({
	id,
	title,
}: {
	id: string;
	title?: string;
}) {
	const [showConfirm, setShowConfirm] = useState(false);
	const { mutate: deleteCoach, isPending } = useDeleteCoach();

	const handleDelete = () => {
		deleteCoach(id, {
			onSuccess: () => {
				setShowConfirm(false);
			},
		});
	};

	if (showConfirm) {
		return (
			<div className="flex items-center gap-2">
				<span className="text-sm text-brand">
					Delete {title ? `"${title}"` : 'this coach'}?
				</span>
				<button
					onClick={handleDelete}
					disabled={isPending}
					className="px-2 py-1 text-xs bg-brand text-white rounded hover:bg-brand disabled:opacity-50"
				>
					{isPending ? 'Deleting...' : 'Yes'}
				</button>
				<button
					onClick={() => setShowConfirm(false)}
					disabled={isPending}
					className="px-2 py-1 text-xs bg-line text-ink-3 rounded hover:bg-line-strong"
				>
					Cancel
				</button>
			</div>
		);
	}

	return (
		<Trash
			onClick={() => setShowConfirm(true)}
			className="cursor-pointer hover:text-brand transition-colors"
		/>
	);
}