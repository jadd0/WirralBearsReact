import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { Footer } from '@components/layout/Footer';

// Simple inline SVG check icon in red
const CheckIcon = () => (
	<svg
		className="w-6 h-6 text-red-500 flex-shrink-0"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		viewBox="0 0 24 24"
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
	</svg>
);

export default function AnInclusiveApproachPage() {
	return (
		<div className="min-h-screen font-sans flex flex-col">
			<LogoBanner />
			<main className="flex-1 flex flex-col items-center px-4">
				{/* Hero Section */}
				<section className="w-full max-w-2xl text-center py-10">
					<h1 className="text-4xl font-extrabold mb-4 tracking-tight">
						We Tailor Our Approach <br className="hidden sm:inline" /> to Every
						Young Player
					</h1>
					<p className="text-lg text-gray-700 mb-6">
						Every player’s journey is unique. Whether you love competitive
						drills or relaxed games, we have a place for you.
					</p>
				</section>

				{/* Dual Approach Cards */}
				<section className="w-full max-w-3xl grid sm:grid-cols-2 gap-6 mb-8">
					<div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border-t-4 border-red-500">
						<span className="inline-block bg-red-50 p-3 rounded-full mb-3">
							<svg
								className="w-8 h-8 text-red-500"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
								/>
							</svg>
						</span>
						<h2 className="text-xl font-bold mb-2">
							Competitive & Disciplined
						</h2>
						<p className="text-gray-600 text-center">
							Enjoy challenging training and matches? We offer structured
							sessions and competitive play.
						</p>
					</div>
					<div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border-t-4 border-red-500">
						<span className="inline-block bg-red-50 p-3 rounded-full mb-3">
							<svg
								className="w-8 h-8 text-red-500"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</span>
						<h2 className="text-xl font-bold mb-2">
							Relaxed & Fun
						</h2>
						<p className="text-gray-600 text-center">
							Prefer a more relaxed vibe? We create a welcoming space for
							everyone to enjoy basketball at their own pace.
						</p>
					</div>
				</section>

				{/* Bridge Statement */}
				<div className="w-full max-w-2xl bg-red-50 rounded-xl shadow p-6 mb-8 text-center">
					<p className="text-lg text-gray-700">
						<span className="font-semibold text-red-600">
							Both are equal to us.
						</span>{' '}
						We help every player find their place and bridge the gap between
						different styles.
					</p>
				</div>

				{/* Funding & Assurance Model */}
				<InfoBox className="w-full max-w-2xl bg-red-700">
					<div className="flex items-center mb-4">
						<svg
							className="w-8 h-8 text-white mr-2"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 8v4l3 3M12 19a7 7 0 100-14 7 7 0 000 14z"
							/>
						</svg>
						<h2 className="text-xl font-bold text-white">
							Funding & Assurance Model
						</h2>
					</div>
					<ul className="space-y-3">
						<li className="flex items-start">
							<CheckIcon />
							<span className="ml-2">
								High quality, certified coaching for all
							</span>
						</li>
						<li className="flex items-start">
							<CheckIcon />
							<span className="ml-2">
								Participation at every ability level, including matches
							</span>
						</li>
						<li className="flex items-start">
							<CheckIcon />
							<span className="ml-2">
								Consistent, focused coaching for each group
							</span>
						</li>
					</ul>
				</InfoBox>

				{/* <div className="w-full max-w-3xl flex justify-center my-10">
					<img
						src="/images/AZ4A5789.jpg"
						alt="High five"
						className="rounded-2xl shadow-xl w-full object-cover max-h-72"
					/>
				</div> */}
				{/* TODO: add image */}

				{/* Our Approach & Background */}
				<section className="w-full max-w-5xl grid md:grid-cols-3 gap-6 mb-12">
					<div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border-l-4 border-red-500">
						<h3 className="text-lg font-bold text-red-600 mb-2">
							Inclusive Coaching
						</h3>
						<p className="text-gray-700 text-center">
							Experienced, teacher-led coaches. No favouritism, no over-focus on
							star players. We build from the bottom up and keep games fair.
						</p>
					</div>
					<div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border-l-4 border-red-500">
						<h3 className="text-lg font-bold text-red-600 mb-2">
							Transparent Funding
						</h3>
						<p className="text-gray-700 text-center">
							100% of funds go to the junior program. Sponsorships welcome. All
							finances are open and transparent.
						</p>
					</div>
					<div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border-l-4 border-red-500">
						<h3 className="text-lg font-bold text-red-600 mb-2">
							Support for All
						</h3>
						<p className="text-gray-700 text-center">
							Associate program: players needing extra help can contribute to
							the club in lieu of fees or kit. No child left behind.
						</p>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
