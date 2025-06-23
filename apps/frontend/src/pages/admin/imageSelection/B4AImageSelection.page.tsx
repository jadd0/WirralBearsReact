import CarouselImageSelector from '@/components/imageSelection/CarouselImageSelector';
import {
  useGetAllB4ACarouselImages,
  useReplaceAllB4ACarouselImages,
} from '@/hooks/image.hooks';

const policies = [
  { title: 'Joy' },
  { title: 'Positivity' },
  { title: 'Respect' },
  { title: 'Equality' },
  { title: 'Dedication and Effort' },
  { title: 'Growth' },
  { title: 'Pass' },
  { title: 'Defence' },
  { title: 'Shoot' },
  { title: 'Play' },
];

export default function B4AImageSelectionPage() {
  return (
    <CarouselImageSelector
      title="Image Selection for B4A Carousel"
      description="Click on an image to change it. Each image corresponds to a specific policy."
      showKeyLabels={true}
      keyLabels={policies.map(policy => policy.title)}
      imageCount={10}
      gridCols={5}
      useGetAllImages={useGetAllB4ACarouselImages}
      useReplaceAllImages={useReplaceAllB4ACarouselImages}
    />
  );
}
