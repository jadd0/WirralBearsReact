import { useParams } from 'react-router-dom';
import CoachDisplay from '@/components/postDisplay/CoachDisplay';

export default function CoachViewPage() {
	const { slug } = useParams();
	console.log({ slug });
	return (
		<>
			<CoachDisplay id={slug ?? ''} />
		</>
	);
}
