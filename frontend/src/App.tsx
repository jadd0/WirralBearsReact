import { Routes, Route, useLocation } from 'react-router-dom';
import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { toast, Toaster } from 'sonner';
import { OnLoadingErrorView, LoadingView } from './components/layout/Loading';
import { useMe } from './hooks/auth.hooks';
import { useState } from 'react';

import AnInclusiveApproachPage from './pages/AnInclusiveApproach.page';
import AssurancesPage from './pages/Assurances.page';
import BallForAllPage from './pages/BallForAll.page';
import Home from './pages/Home.page';
import LoginPage from './pages/Login.page';
import Logout from './pages/Logout.page';
import SponsorshipPage from './pages/Sponsorship.page';

/**
 * A router that protects the routes it wraps by checking if the user is authenticated.
 *
 */
function AuthenticatedRouter() {
	const { data, isPending, error, refetch } = useMe();

	if (error)
		toast.error(
			'Failed to verify authentication status! Please try again later.'
		);

	if (error)
		return (
			<OnLoadingErrorView
				message={
					<>
						We’re having trouble verifying your access.
						<br /> Please try again later.
					</>
				}
				onRetry={() => refetch()}
			/>
		);

	if (isPending) return <LoadingView />;

	if (!data?.authenticated || !data.user) return <Navigate to="/login" />;

	return <Outlet />;
}

/**
 * A router that protects the routes it wraps by checking if the user is unauthenticated.
 *
 */
function UnauthenticatedRouter() {
	const { data, isPending, error, refetch } = useMe();

	useEffect(() => {
		if (error)
			toast.error(
				'Failed to verify authentication status! Please try again later.'
			);
	}, [error]);

	if (error)
		return (
			<OnLoadingErrorView
				message={
					<>
						We’re having trouble verifying your access.
						<br /> Please try again later.
					</>
				}
				onRetry={() => refetch()}
			/>
		);

	if (isPending) return <LoadingView />;

	if (data?.authenticated || data?.user) return <Navigate to="/feed" />;

	return <Outlet />;
}

function App() {
	return (
		<div className="w-screen h-screen flex flex-row flex-nowrap justify-start">
			<Routes>
				<Route element={<AuthenticatedRouter />}>
					<Route path="/admin" element={<div>Admin</div>} />
					<Route path="/logout" element={<Logout />} />
				</Route>
				<Route
					path="/aninclusiveapproach"
					element={<AnInclusiveApproachPage />}
				/>
				<Route path="/assurances" element={<AssurancesPage />} />

				<Route path="/ballforall" element={<BallForAllPage />} />

				<Route index element={<Home />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/sponsorship" element={<SponsorshipPage />} />
			</Routes>
			<Toaster position="top-right" closeButton={false} />
		</div>
	);
}

export default App;
