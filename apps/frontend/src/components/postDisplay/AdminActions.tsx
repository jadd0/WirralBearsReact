import { useNavigate } from 'react-router-dom';
import BlogDelete from './BlogDelete';
import CoachDelete from './CoachDelete';
import { convertFullBlogToBlogData } from '@/lib/blogUtils';

export default function AdminActions({
	id,
	data,
	coach: coach,
}: {
	id: string;
	data: any;
	coach: boolean;
}) {
	const navigate = useNavigate();

	const handleEditClick = () => {
		const convertedData = convertFullBlogToBlogData(data);
		navigate(`/admin/${coach ? 'coach' : 'blog'}/edit/${id}`, {
			state: { blogData: convertedData },
		});
	};

	return (
		<div className="mb-4 flex gap-5">
			<button
				onClick={handleEditClick}
				className="text-blue-500 hover:underline cursor-pointer"
			>
				Edit {coach ? 'Coach' : 'Blog'} Post
			</button>

			{coach ? <CoachDelete id={id} /> : <BlogDelete id={id} />}
		</div>
	);
}
