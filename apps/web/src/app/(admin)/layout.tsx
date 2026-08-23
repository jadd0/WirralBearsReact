import { AdminNavbar } from '@components/layout/AdminNavbar';
import { AuthGuard } from '@components/layout/AuthGuard';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<AdminNavbar />
			<main id="main" className="box-border flex w-full flex-1 flex-col items-center">
				<AuthGuard>{children}</AuthGuard>
			</main>
		</>
	);
}
