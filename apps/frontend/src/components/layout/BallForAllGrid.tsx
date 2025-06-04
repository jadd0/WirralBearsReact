import { CarouselComponent } from '@components/layout/Carousel';

// Example: generate random Unsplash images for demonstration
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

// Generate random Unsplash images for each policy
const carouselImages = policies.map((policy, idx) => ({
	id: idx + 1,
	src: `https://picsum.photos/800/400?random=${idx + 1}&basketball`, // random basketball images
	name: policy.title,
}));

const headings = policies.map((policy) => policy.title);

export function BallForAllGrid() {
	return (
		<div className="w-full max-w-lg mx-auto my-8">
			<CarouselComponent images={carouselImages} headings={headings} />
		</div>
	);
}
