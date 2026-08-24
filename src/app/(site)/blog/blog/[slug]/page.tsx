import type { Metadata } from 'next';
import BlogView from '@views/blog/BlogView';

export const metadata: Metadata = {
	title: 'Blog post',
	description: 'A post from the Wirral Bears club blog.',
};

export default function Page() {
	return <BlogView />;
}
