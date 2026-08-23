'use client';

import { useGetAllBlogPreviews } from '@hooks/blog.hooks';
import BlogAllPreviews from '@components/blog/BlogAllPreviews';
import { PageHeader } from '@components/layout/PageHeader';

export default function ViewBlogsPage() {
	const { data, isLoading } = useGetAllBlogPreviews();

	return (
		<>
			<PageHeader
				eyebrow="Club news"
				title="From the club"
				lead="Match reports, session news and updates from around Wirral Bears."
			/>
			<section className="section">
				<div className="container-page">
					<BlogAllPreviews isLoading={isLoading} blogs={data || []} />
				</div>
			</section>
		</>
	);
}
