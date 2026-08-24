import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import LoginPage from '@views/Login.page';
import { LoadingView } from '@components/layout/Loading';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
	title: 'Sign in',
	robots: { index: false, follow: false },
};

export default async function Page() {
	const session = await auth();
	if (session?.user?.isAdmin) redirect('/admin');

	// LoginPage reads the ?error query param via useSearchParams, which opts the
	// route into client rendering unless it sits behind a Suspense boundary.
	return (
		<Suspense fallback={<LoadingView />}>
			<LoginPage />
		</Suspense>
	);
}
