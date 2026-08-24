'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import { queryClient } from '@lib/query';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<Toaster position="top-right" closeButton={false} />
				{children}
			</QueryClientProvider>
		</SessionProvider>
	);
}
