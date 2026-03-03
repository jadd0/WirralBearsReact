import BlogDelete from "./BlogDelete";
import CoachDelete from "./CoachDelete";
import { convertFullBlogToBlogData } from "@/lib/utils/blogUtils";
import { useRouter } from "next/navigation";

export default function AdminActions({
  id,
  data,
  coach: coach,
}: {
  id: string;
  data: any;
  coach: boolean;
}) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/admin/${coach ? "coach" : "blog"}/edit/${id}`);
  };

  return (
    <div className="mb-4 flex gap-5">
      <button
        onClick={handleEditClick}
        className="text-blue-500 hover:underline cursor-pointer"
      >
        Edit {coach ? "Coach" : "Blog"} Post
      </button>

      {coach ? <CoachDelete id={id} /> : <BlogDelete id={id} />}
    </div>
  );
}
