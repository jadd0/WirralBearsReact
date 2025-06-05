import { CoachPreview } from '@wirralbears/backend-types';
import { Link } from 'react-router-dom';

export default function CoachPreviewElement({
	coach,
}: {
	coach: CoachPreview;
}) {
	return (
		<Link
			key={coach.id}
			to={`/coaches/coach/${coach.id}`}
			className="no-underline"
		>
			<article className="flex flex-col items-center gap-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden p-8">
				{/* Image will scale up with grid column size */}
				<div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
					<img
						src={coach.image?.url ?? '/placeholder-image.jpg'}
						alt={coach.image?.alt ?? 'Coach preview'}
						className="w-full h-full object-cover"
					/>
				</div>
				<h2 className="text-2xl font-extrabold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 text-center">
					{coach.title}
				</h2>
			</article>
		</Link>
	);
}
