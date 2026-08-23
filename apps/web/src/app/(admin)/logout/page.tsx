import type { Metadata } from 'next';
import Logout from '@views/Logout.page';

export const metadata: Metadata = {
	title: 'Signing out',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <Logout />;
}
