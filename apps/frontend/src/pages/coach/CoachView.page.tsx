import { useParams } from 'react-router-dom';
import CoachDisplay from '@/components/blog/postDisplay/CoachDisplay';

export default function CoachViewPage() {
	const { slug } = useParams();

	return (
		<>
			<CoachDisplay id={slug ?? ''} />
		</>
	);
}
