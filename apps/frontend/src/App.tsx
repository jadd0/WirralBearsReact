import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { toast, Toaster } from 'sonner';
import { OnLoadingErrorView, LoadingView } from './components/layout/Loading';
import { useMe } from './hooks/auth.hooks';
import { Navbar } from './components/layout/Navbar';
import { Outlet, Navigate } from 'react-router-dom';

import AnInclusiveApproachPage from './pages/AnInclusiveApproach.page';
import AssurancesPage from './pages/Assurances.page';
import BallForAllPage from './pages/BallForAll.page';
import Home from './pages/Home.page';
import LoginPage from './pages/Login.page';
import Logout from './pages/Logout.page';
import SponsorshipPage from './pages/Sponsorship.page';
import ViewBlogsPage from './pages/blog/ViewBlogs.page';
import ViewCoachesPage from './pages/coach/ViewCoaches.page';
import CoachViewPage from './pages/coach/CoachView.page';
import SessionsPage from './pages/Sessions.page';
import GamesPage from './pages/Games.page';

// Admin
import AdminPage from './pages/admin/Admin.page';
import { AdminNavbar } from './components/layout/AdminNavbar';
import BlogView from './pages/blog/BlogView';
import AllImagesViewPage from './pages/image/AllImageView.page';
import ImageDashboardPage from './pages/admin/image/ImageDashboard.page';
import CreatePage from './pages/admin/post/Create.page';
import EditPage from './pages/admin/post/Edit.page';
import EditSessionsPage from './pages/admin/Sessions.page';
import GamesEditCreatePage from './pages/admin/games/GamesCreate.page';
import MultipleImageUploadPage from './pages/admin/image/ImagesUpload.page';
import ImageSelectionPage from './pages/admin/imageSelection/ImageSelection.page';
import FirstImageSelectionPage from './pages/admin/imageSelection/FirstImageSelection.page';
import B4AImageSelectionPage from './pages/admin/imageSelection/B4AImageSelection.page';

function AuthenticatedRouter() {
	const { data, isPending, error, refetch } = useMe();

	console.log(data);

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

const KeepAlive = () => {
	useEffect(() => {
		const keepBackendAwake = async () => {
			try {
				await fetch('https://api.wirralbears.com/health', {
					method: 'GET',
				});
				console.log('Keep-alive ping sent');
			} catch (error) {
				console.error('Keep-alive ping failed:', error);
			}
		};

		// Call immediately on mount
		keepBackendAwake();

		// Set up interval to call every 5 minutes
		const interval = setInterval(keepBackendAwake, 5 * 60 * 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(interval);
	}, []);

	return null; 
};

// function UnauthenticatedRouter() {
// 	const { data, isPending, error, refetch } = useMe();

// 	useEffect(() => {
// 		if (error)
// 			toast.error(
// 				'Failed to verify authentication status! Please try again later.'
// 			);
// 	}, [error]);

// 	if (error)
// 		return (
// 			<OnLoadingErrorView
// 				message={
// 					<>
// 						We’re having trouble verifying your access.
// 						<br /> Please try again later.
// 					</>
// 				}
// 				onRetry={() => refetch()}
// 			/>
// 		);

// 	if (isPending) return <LoadingView />;

// 	if (data?.authenticated || data?.user) return <Navigate to="/feed" />;

// 	return <Outlet />;
// }

function App() {
	const { pathname } = useLocation();

	const shouldShowNav = useMemo(() => {
		// Check if the path starts with "/admin"
		if (pathname.startsWith('/admin')) {
			return false;
		}

		// Check other routes that should hide the navbar
		const otherHiddenRoutes = ['/login', '/logout', '/logout/'];
		return !otherHiddenRoutes.includes(pathname);
	}, [pathname]);

	return (
		<div className="font-sans tracking-wide flex flex-col min-h-screen w-full bg-gray-#d3d2d2">
			<Toaster position="top-right" closeButton={false} />
			<KeepAlive />

			{shouldShowNav && <Navbar />}
			{!shouldShowNav && <AdminNavbar />}

			<main className="flex-1 w-full flex flex-col items-center box-border">
				<Routes>
					<Route element={<AuthenticatedRouter />}>
						<Route path="/admin" element={<AdminPage />} />
						<Route
							path="/admin/blog/createPost"
							element={<CreatePage type={'blog'} />}
						/>
						<Route
							path="/admin/blog/edit/:id"
							element={<EditPage type={'blog'} />}
						/>
						<Route path="/admin/image/" element={<ImageDashboardPage />} />
						<Route
							path="/admin/coach/create"
							element={<CreatePage type={'coach'} />}
						/>
						<Route
							path="/admin/coach/edit/:id"
							element={<EditPage type={'coach'} />}
						/>
						<Route path="/admin/sessions" element={<EditSessionsPage />} />
						<Route
							path="/admin/games/create"
							element={<GamesEditCreatePage />}
						/>

						<Route
							path="/admin/multipleImageUpload"
							element={<MultipleImageUploadPage />}
						/>

						<Route
							path="/admin/imageSelection"
							element={<ImageSelectionPage />}
						/>
						<Route
							path="/admin/imageSelection/first"
							element={<FirstImageSelectionPage />}
						/>
						<Route
							path="/admin/imageSelection/b4a"
							element={<B4AImageSelectionPage />}
						/>

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
					<Route path="/sessions" element={<SessionsPage />} />
					<Route path="/games" element={<GamesPage />} />

					{/* Blog routes */}
					<Route path="/blog/blogs" element={<ViewBlogsPage />} />
					<Route path="/blog/blog/:slug" element={<BlogView />} />

					{/* Image routes */}
					<Route path="/image/viewall" element={<AllImagesViewPage />} />

					{/* Coaches routes */}
					<Route path="/coaches" element={<ViewCoachesPage />} />
					<Route path="/coaches/coach/:slug" element={<CoachViewPage />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
