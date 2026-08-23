import type { Metadata } from 'next';
import EditPage from '@views/admin/post/Edit.page';

export const metadata: Metadata = {
	title: 'Edit post',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <EditPage type={'blog'} />;
}
