import { useParams } from 'react-router-dom';
import BlogDisplay from '@/components/blog/BlogDisplay';

export default function BlogView() {
  const { slug } = useParams();

  return <>
  <BlogDisplay id={slug ?? ''} />
  </>
}