'use client';

import { useParams } from 'next/navigation';
import CoachDisplay from '@/components/postDisplay/CoachDisplay';

export default function CoachViewPage() {
  const params = useParams<{ slug: string }>();
	const slug = params?.slug;

  return (
    <div className="min-h-screen flex flex-col min-w-full">
      <div className="flex-1">
        <CoachDisplay id={slug ?? ''} />
      </div>
    </div>
  );
}