import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuthError = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const showErrorToast = useCallback((errorMessage: string) => {
		toast.error(errorMessage, {
      className: 'error-toast'
    });
	}, []);

	useEffect(() => {
		const error = searchParams.get('error');

		if (error) {
			let errorMessage = 'Authentication failed';

			switch (error) {
				case 'auth_failed':
					errorMessage = 'Authentication failed. Please try again.';
					break;
				case 'unauthorised':
					errorMessage = 'Access denied. Your email is not authorized.';
					break;
				case 'server_error':
					errorMessage = 'Server error occurred. Please try again later.';
					break;
				default:
					errorMessage = 'An error occurred during authentication.';
			}

			// Use the extracted function
			showErrorToast(errorMessage);

			// Clean up the URL by removing the error parameter
			searchParams.delete('error');
			setSearchParams(searchParams, { replace: true });
		}
	}, [searchParams, setSearchParams, showErrorToast]);
};
