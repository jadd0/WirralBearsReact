'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@lib/query';
import { KeepAlive } from '@components/layout/KeepAlive';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<Toaster position="top-right" closeButton={false} />
			<KeepAlive />
			{children}
		</QueryClientProvider>
	);
}
