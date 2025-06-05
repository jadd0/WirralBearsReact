import { useNavigate } from 'react-router-dom';
import BlogDelete from './BlogDelete';
import { convertFullBlogToBlogData } from '@/lib/blogUtils';

export default function AdminActions({
  id,
  data,
  isCoach,
}: {
  id: string;
  data: any;
  isCoach: boolean;
}) {
  const navigate = useNavigate();

  const handleEditClick = () => {
    const convertedData = convertFullBlogToBlogData(data);
    navigate(`/admin/${isCoach ? 'coach' : 'blog'}/edit/${id}`, {
      state: { blogData: convertedData },
    });
  };

  return (
    <div className="mb-4 flex gap-5">
      <button
        onClick={handleEditClick}
        className="text-blue-500 hover:underline cursor-pointer"
      >
        Edit {isCoach ? 'Coach' : 'Blog'} Post
      </button>
      <BlogDelete id={id} />
    </div>
  );
}
