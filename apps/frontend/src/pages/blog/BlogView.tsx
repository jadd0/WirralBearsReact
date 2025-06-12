import { useParams } from 'react-router-dom';
import BlogDisplay from '@/components/postDisplay/BlogDisplay';
import { LogoBanner } from '@/components/layout/LogoBanner';
import { Footer } from '@/components/layout/Footer';

export default function BlogView() {
	const { slug } = useParams();

	return (
		<div className="min-w-full">
			<LogoBanner />
			<BlogDisplay id={slug ?? ''} />
			<Footer />
		</div>
	);
}
