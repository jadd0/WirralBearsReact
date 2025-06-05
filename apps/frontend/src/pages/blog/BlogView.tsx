import { useParams } from 'react-router-dom';
import BlogDisplay from '@/components/blog/postDisplay/BlogDisplay';

export default function BlogView() {
	const { slug } = useParams();

	return (
		<>
			<BlogDisplay id={slug ?? ''} />
		</>
	);
}
