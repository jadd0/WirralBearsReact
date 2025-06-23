import { useParams } from 'react-router-dom';
import CoachDisplay from '@/components/postDisplay/CoachDisplay';
import { LogoBanner } from '@/components/layout/LogoBanner';
import { Footer } from '@/components/layout/Footer';

export default function CoachViewPage() {
  const { slug } = useParams();

  return (
    <div className="min-h-screen flex flex-col min-w-full">
      <LogoBanner />
      <div className="flex-1">
        <CoachDisplay id={slug ?? ''} />
      </div>
      <Footer />
    </div>
  );
}
