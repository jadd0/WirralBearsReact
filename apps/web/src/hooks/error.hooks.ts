'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const ERROR_MESSAGES: Record<string, string> = {
	auth_failed: 'Authentication failed. Please try again.',
	unauthorised: 'Access denied. Your email is not authorised.',
	server_error: 'Server error occurred. Please try again later.',
};

export const useAuthError = () => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const showErrorToast = useCallback((errorMessage: string) => {
		toast.error(errorMessage, {
			className: 'error-toast',
		});
	}, []);

	useEffect(() => {
		const error = searchParams.get('error');

		if (!error) return;

		showErrorToast(
			ERROR_MESSAGES[error] ?? 'An error occurred during authentication.'
		);

		// Clean up the URL so a refresh does not re-show the toast. Next's
		// useSearchParams is read-only, so rewrite the query string ourselves.
		const remaining = new URLSearchParams(searchParams.toString());
		remaining.delete('error');
		const query = remaining.toString();

		router.replace(query ? `${pathname}?${query}` : pathname);
	}, [searchParams, pathname, router, showErrorToast]);
};
