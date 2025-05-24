import { useParams } from 'react-router-dom';

export default function BlogView() {
  const { slug } = useParams();
  console.log(slug)

  return <></>
}