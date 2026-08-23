import type { Metadata } from 'next';
import CreatePage from '@views/admin/post/Create.page';

export const metadata: Metadata = {
	title: 'Create coach',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <CreatePage type={'coach'} />;
}
