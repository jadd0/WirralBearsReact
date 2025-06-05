import { BlogEdit } from "@/components/postEdit/BlogEdit";
import { CoachEdit } from "@/components/postEdit/CoachEdit";

interface EditPageProps {
  type: 'blog' | 'coach';
}

export default function EditPage({ type }: EditPageProps) {
  return type === 'coach' ? <CoachEdit /> : <BlogEdit />;
}
