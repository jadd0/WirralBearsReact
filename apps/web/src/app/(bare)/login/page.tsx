import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginPage from '@views/Login.page';
import { LoadingView } from '@components/layout/Loading';

export const metadata: Metadata = {
	title: 'Sign in',
	robots: { index: false, follow: false },
};

export default function Page() {
	// LoginPage reads the ?error query param via useSearchParams, which opts the
	// route into client rendering unless it sits behind a Suspense boundary.
	return (
		<Suspense fallback={<LoadingView />}>
			<LoginPage />
		</Suspense>
	);
}
