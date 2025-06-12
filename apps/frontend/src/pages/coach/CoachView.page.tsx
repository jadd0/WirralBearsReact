import { useParams } from 'react-router-dom';
import CoachDisplay from '@/components/postDisplay/CoachDisplay';
import { LogoBanner } from '@/components/layout/LogoBanner';
import { Footer } from '@/components/layout/Footer';

export default function CoachViewPage() {
	const { slug } = useParams();

	return (
		<div className="min-w-full min-h-screen">
			<LogoBanner />
			<CoachDisplay id={slug ?? ''} />
			<Footer />
		</div>
	);
}
