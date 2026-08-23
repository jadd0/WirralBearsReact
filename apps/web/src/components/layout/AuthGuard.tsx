'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMe } from '@hooks/auth.hooks';
import { LoadingView, OnLoadingErrorView } from '@components/layout/Loading';

/**
 * Gates the admin area. Mirrors the old AuthenticatedRouter: unauthenticated
 * visitors are sent to /login, and a failed check offers a retry rather than
 * silently dropping them.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
	const { data, isPending, error, refetch } = useMe();
	const router = useRouter();

	const authenticated = Boolean(data?.authenticated && data.user);

	useEffect(() => {
		if (error) {
			toast.error(
				'Failed to verify authentication status. Please try again later.'
			);
		}
	}, [error]);

	useEffect(() => {
		if (!isPending && !error && !authenticated) {
			router.replace('/login');
		}
	}, [isPending, error, authenticated, router]);

	if (error) {
		return (
			<OnLoadingErrorView
				message={
					<>
						We&rsquo;re having trouble verifying your access.
						<br /> Please try again later.
					</>
				}
				onRetry={() => refetch()}
			/>
		);
	}

	if (isPending || !authenticated) return <LoadingView />;

	return <>{children}</>;
}
