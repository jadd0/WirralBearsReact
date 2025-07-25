import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { CarouselComponent } from '@components/layout/Carousel';
import { MapboxMap } from '@components/layout/Mapbox';
import { BallForAllGrid } from '@components/layout/BallForAllGrid';
import { Footer } from '@components/layout/Footer';
import BlogAllPreviews from '@/components/blog/BlogAllPreviews';
import { useGetAllBlogPreviews } from '@/hooks/blog.hooks';
import { useGetAllFirstCarouselImages } from '@/hooks/image.hooks';
import { use } from 'react';

interface CarouselImage {
	id?: string;
	imageId: string;
	key: string;
	createdAt?: Date;
	updatedAt?: Date;
	imageUrl?: string;
}

export default function HomePage() {
	const { data: blogs = [], isLoading: blogsLoading } = useGetAllBlogPreviews();
	const {
		data: carouselImages = [] as CarouselImage[],
		isLoading: carouselLoading,
	} = useGetAllFirstCarouselImages();

	return (
		<div className="min-h-screen w-full font-sans flex flex-col">
			<LogoBanner />

			<main className="flex-1 flex flex-col items-center px-4">
				{/* Hero Section */}
				<section className="w-full max-w-3xl text-center py-10">
					<h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow">
						Welcome to Wirral Bears Basketball Club
					</h1>
					<p className="text-lg text-gray-700 mb-6">
						Building skills. Building confidence. Building community.
						<br />
						We are a vibrant, inclusive basketball club in Woodchurch,
						Wirral—helping players of all ages and backgrounds find their love
						for the game.
					</p>
				</section>

				{/* About Us Section */}
				<InfoBox
					title="About Us"
					className="w-full max-w-2xl bg-gray-700 shadow-md shadow-red-700/30"
				>
					<p>
						Whether you're picking up a basketball for the first time or aiming
						for the next level, you'll find your place here. <br />
						<span className="text-red-400 font-semibold">
							Beginner, Intermediate, or Advanced
						</span>
						—everyone is welcome.
					</p>
					<ul className="list-disc list-inside mt-4 space-y-1 text-gray-200">
						<li>Friendly, supportive coaching</li>
						<li>Fun, challenging sessions for all ages</li>
						<li>Strong community spirit—on and off the court</li>
					</ul>
				</InfoBox>

				{/* Carousel Section */}
				<section className="w-full max-w-3xl my-10">
					<CarouselComponent
						images={carouselImages}
						isLoading={carouselLoading}
					/>
				</section>

				{/* Rest of your components remain the same... */}
				{/* Join Section */}
				<InfoBox
					title="Thinking of joining?"
					className="w-full max-w-2xl bg-gray-700 shadow-md shadow-red-700/30 mb-10"
				>
					<p>
						<span className="font-bold text-red-400">Joining is easy!</span>{' '}
						Just show up to a session for your age group—your, the first taster session is
						free to ensure you love it before committing
						<br />
						<br />
						<span className="text-gray-200">
							Ready to get started? Complete your joining form below:
						</span>
					</p>
					<div className="mt-6 flex justify-center">
						<button
							className="bg-red-600 text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-red-700 transition-colors border-2 border-red-600"
							onClick={() =>
								window.open(
									'https://docs.google.com/forms/d/1xyuIacKZlv96QKh8mAARyrk7MR2WHATB1tTouBxo0CU/viewform?edit_requested=true',
									'_blank'
								)
							}
						>
							Join Now
						</button>
					</div>
				</InfoBox>

				{/* Recent blogs */}
				<div className="flex-col min-w-full m-6 mb-12">
					<h2 className="text-xl sm:text-2xl font-bold mb-3 text-center">
						Recent Blog Posts
					</h2>
					<BlogAllPreviews blogs={blogs} isLoading={blogsLoading} limit={3} />
				</div>

				{/* Location Section */}
				<section className="w-full max-w-2xl text-center mb-10">
					<h3 className="text-2xl font-extrabold mb-4">Our Location</h3>
					<div className="rounded-2xl shadow-lg overflow-hidden">
						<MapboxMap />
					</div>
				</section>

				{/* Ball 4 All Section */}
				<InfoBox
					title="Ball 4 All"
					className="w-full max-w-2xl bg-gray-700 shadow-md shadow-red-700/30 mb-10"
				>
					<p>
						<span className="text-red-400 font-bold">Our Promise:</span>{' '}
						Everyone—player or coach—must commit to our 10 Ball for All
						principles. These values make our club a safe, fair, and exciting
						place to play and grow.
					</p>
					<div className="mt-6">
						<BallForAllGrid />
					</div>
				</InfoBox>
			</main>
			<Footer />
		</div>
	);
}
