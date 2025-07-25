import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@lib/query';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/next';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App />
				<Analytics />
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
);
