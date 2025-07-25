import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { Footer } from '@components/layout/Footer';

// Inline SVG for red check icon
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

// Ball for All principles as data for functional rendering
const PRINCIPLES = [
	{ title: 'Joy', desc: "It's the essence of success." },
	{ title: 'Positivity', desc: 'Positive mental attitude is key.' },
	{
		title: 'Respect',
		desc: 'We treat others like we would like to be treated.',
	},
	{
		title: 'Equal Focus & Equal Minutes',
		desc: 'We are all part of this team.',
	},
	{ title: 'Dedication & Effort', desc: "It's how we get better." },
	{
		title: 'Growth',
		desc: "It's where we are now, and where we will be in the future.",
	},
	{ title: 'Pass', desc: 'Because ball hogging ruins the game.' },
	{ title: 'Defence', desc: 'It wins championships.' },
	{
		title: 'Shoot',
		desc: "When it's good and within range. The only miss is not taking a good shot.",
	},
	{ title: 'Play', desc: 'Together as a team.' },
];

export default function BallForAllPage() {
	return (
		<div className="min-h-screen min-w-full font-sans flex flex-col">
			<LogoBanner />
			<main className="flex-1 flex flex-col items-center px-4">
				{/* Hero Section */}
				<section className="w-full max-w-2xl text-center py-10">
					<h1 className="text-4xl font-extrabold mb-4 tracking-tight">
						Ball for All: Our Commitment
					</h1>
					<p className="text-lg text-gray-700 mb-6">
						To join our Basketball Club, every player and coach must commit to the
						Ball for All principles. These create great, enjoyable basketball
						for everyone.
					</p>
				</section>

				{/* Commitment Steps */}
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
									d="M12 8v4l3 3M12 19a7 7 0 100-14 7 7 0 000 14z"
								/>
							</svg>
						</span>
						<h2 className="text-xl font-bold mb-2">How to Join</h2>
						<ul className="text-gray-700 space-y-2 text-left list-disc list-inside">
							<li>Discuss the principles with coaches and team-mates.</li>
							<li>Sign and commit to them.</li>
							<li>Play by them, every session.</li>
						</ul>
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
						<h2 className="text-xl font-bold mb-2">Our Promise</h2>
						<p className="text-gray-700 text-center">
							No player will be asked to leave the club unless they do not
							follow these principles.
						</p>
					</div>
				</section>

				{/* Principles Section */}
				<InfoBox
					title="The Ball for All Principles"
					className="w-full max-w-2xl bg-gray-700"
				>
					<ul className="space-y-4">
						{PRINCIPLES.map(({ title, desc }) => (
							<li key={title} className="flex items-start">
								<CheckIcon />
								<span className="ml-3">
									<span className="font-bold text-white">{title}</span>
									<span className="text-white"> – {desc}</span>
								</span>
							</li>
						))}
					</ul>
				</InfoBox>

				<span className="font-semibold text-xl mt-4">
					Because it's ball for all, not just some.
				</span>
			</main>
			<Footer />
		</div>
	);
}
