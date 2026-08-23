'use client';

import { useParams } from 'next/navigation';
import BlogDisplay from '@/components/postDisplay/BlogDisplay';

export default function BlogView() {
	const params = useParams<{ slug: string }>();
	const slug = params?.slug;

	return (
		<div className="min-w-full">
			<BlogDisplay id={slug ?? ''} />
		</div>
	);
}