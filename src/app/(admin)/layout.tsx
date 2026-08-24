import { AdminNavbar } from '@components/layout/AdminNavbar';
import { requireAdminPage } from '@/lib/auth';

// This redirect is UX only, not the security boundary: Next renders a
// layout and its child page concurrently, so a redirect() here does not
// stop an unauthenticated request from executing the page's own data
// queries. Every admin page and Server Action must call
// requireAdminPage()/requireAdmin() (or ensureAdmin() for actions) itself.
export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await requireAdminPage();

	return (
		<>
			<AdminNavbar />
			<main id="main" className="box-border flex w-full flex-1 flex-col items-center">
				{children}
			</main>
		</>
	);
}
