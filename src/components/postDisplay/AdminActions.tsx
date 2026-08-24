'use client';

import { useRouter } from 'next/navigation';
import BlogDelete from './BlogDelete';
import CoachDelete from './CoachDelete';

export default function AdminActions({
	id,
	coach,
}: {
	id: string;
	coach: boolean;
}) {
	const router = useRouter();

	return (
		<div className="mb-4 flex gap-5">
			<button
				onClick={() =>
					router.push(`/admin/${coach ? 'coach' : 'blog'}/edit/${id}`)
				}
				className="cursor-pointer text-brand hover:underline"
			>
				Edit {coach ? 'Coach' : 'Blog'} Post
			</button>

			{coach ? <CoachDelete id={id} /> : <BlogDelete id={id} />}
		</div>
	);
}
