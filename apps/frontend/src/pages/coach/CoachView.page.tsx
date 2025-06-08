import { useParams } from 'react-router-dom';
import CoachDisplay from '@/components/postDisplay/CoachDisplay';
import { LogoBanner } from '@/components/layout/LogoBanner';

export default function CoachViewPage() {
	const { slug } = useParams();

	return (
		<>
			<LogoBanner />
			<CoachDisplay id={slug ?? ''} />
		</>
	);
}
