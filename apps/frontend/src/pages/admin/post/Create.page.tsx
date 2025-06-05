import { ContentMakerPage } from '@/components/blog/createBlog/ContentMaker';
import { useSaveBlog } from '@/hooks/blog.hooks';
import { useSaveCoach } from '@/hooks/coach.hooks';

interface CreatePageProps {
	type: 'blog' | 'coach';
}

export default function CreatePage({ type }: CreatePageProps) {
	return type === 'coach' ? (
		<ContentMakerPage
			contentType="coach"
			storageKey="coach-editor-data"
			useSaveHook={useSaveCoach}
			successRedirect="/coaches"
			successMessage="Coach saved successfully!"
			errorMessage="Failed to save coach"
		/>
	) : (
		<ContentMakerPage
			contentType="blog"
			storageKey="blog-editor-data"
			useSaveHook={useSaveBlog}
			successRedirect="/blogs"
			successMessage="Blog saved successfully!"
			errorMessage="Failed to save blog"
		/>
	);
}
