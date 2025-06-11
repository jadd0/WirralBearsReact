import { Routes, Route, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
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
import GamesEditPage from './pages/admin/games/GamesEdit.page';

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
						<Route path="/admin/games/create" element={<GamesEditCreatePage />} />

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

					{/* Admin routes */}
				</Routes>
				<Toaster position="top-right" closeButton={false} />
			</main>
		</div>
	);
}

export default App;
