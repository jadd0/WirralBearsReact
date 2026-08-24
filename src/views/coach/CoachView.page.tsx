'use client';

import { useParams } from 'next/navigation';
import CoachDisplay from '@components/postDisplay/CoachDisplay';

export default function CoachViewPage() {
	const params = useParams<{ slug: string }>();
	const slug = params?.slug;

	return <CoachDisplay id={slug ?? ''} />;
}
