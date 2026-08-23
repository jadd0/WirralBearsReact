'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { useDeleteBlog } from '@/hooks/blog.hooks';

export default function BlogDelete({
	id,
	title,
}: {
	id: string;
	title?: string;
}) {
	const [showConfirm, setShowConfirm] = useState(false);
	const { mutate: deleteBlog, isPending } = useDeleteBlog();

	const handleDelete = () => {
		deleteBlog(id, {
			onSuccess: () => {
				setShowConfirm(false);
			},
		});
	};

	if (showConfirm) {
		return (
			<div className="flex items-center gap-2">
				<span className="text-sm text-brand">
					Delete {title ? `"${title}"` : 'this blog'}?
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