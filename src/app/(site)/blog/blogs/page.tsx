import type { Metadata } from 'next';
import ViewBlogsPage from '@views/blog/ViewBlogs.page';

export const metadata: Metadata = {
	title: 'Blog',
	description: 'Club news, match reports and updates from Wirral Bears.',
};

export default function Page() {
	return <ViewBlogsPage />;
}
