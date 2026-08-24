'use client';

import { LoginForm } from '@/components/login-form';
import { useAuthError } from '@/hooks/error.hooks';
import { Toaster } from 'sonner';

export default function LoginPage() {
	useAuthError();

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="grow flex items-center justify-center h-full">
				<LoginForm className="flex xl:w-lg lg:w-96 w-96 sm:w-lg h-full items-center justify-center border-0" />
			</div>

			<Toaster
				position="top-center"
				richColors
				expand={false}
				duration={4000}
			/>
		</div>
	);
}
