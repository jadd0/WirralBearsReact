import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { Footer } from '@components/layout/Footer';

// Inline SVG for red heart icon
const HeartIcon = () => (
	<svg
		className="w-6 h-6 text-red-500 inline-block mb-1"
		fill="currentColor"
		viewBox="0 0 20 20"
	>
		<path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
	</svg>
);

export default function SponsorshipPage() {
	return (
		<div className="min-h-screen w-screen font-sans flex flex-col overflow-hidden">
			<LogoBanner />
			<main className="flex-1 flex flex-col items-center px-4">
				{/* Hero Section */}
				<section className="w-full max-w-2xl text-center py-10">
					<h1 className="text-4xl font-extrabold mb-4 tracking-tight">
						Our Sponsors
					</h1>
					<p className="text-lg text-gray-700 mb-6">
						We would like to say a special thank you to{' '}
						<span className="font-semibold text-red-600">
							Taylor Brown Solicitors
						</span>{' '}
						and{' '}
						<span className="font-semibold text-red-600">
							Chester Financial Wealth Management Ltd.
						</span>{' '}
						for sponsoring our club. Without them, our club would be nowhere
						near its position today.
					</p>
				</section>

				{/* Sponsors Grid */}
				<section className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
					<a
						href="https://taylorbrownsolicitors.com"
						target="_blank"
						rel="noopener noreferrer"
						className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border-t-4 border-red-500 transition-transform hover:scale-105"
					>
						<img
							src="/images/taylor Brown 1.png"
							alt="Taylor Brown Solicitors"
							className="w-40 h-20 object-contain mb-4"
						/>
						<span className="text-red-600 font-semibold">
							Taylor Brown Solicitors
						</span>
					</a>
					<a
						href="https://www.chesterfinancial.co.uk"
						target="_blank"
						rel="noopener noreferrer"
						className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border-t-4 border-red-500 transition-transform hover:scale-105"
					>
						<img
							src="/images/Chester Financial.png"
							alt="Chester Financial"
							className="w-40 h-20 object-contain mb-4"
						/>
						<span className="text-red-600 font-semibold">
							Chester Financial Wealth Management Ltd.
						</span>
					</a>
				</section>

				{/* Donation Section */}
				<InfoBox
					title={
						<span>
							<HeartIcon /> Donate <HeartIcon />
						</span>
					}
					className="w-full max-w-xl bg-gray-700"
				>
					<p className="mb-4">
						Wirral Bears Basketball Club is a non-profit organisation—yet money
						allows us to carry on. Every pound donated goes towards the club to
						buy balls, kits, and more. Thank you for your support!
					</p>
					<form
						action="https://www.paypal.com/donate"
						method="post"
						target="_top"
						className="flex flex-col items-center"
					>
						<input
							type="hidden"
							name="hosted_button_id"
							value="X7RBJZ2S884D8"
						/>
						<input
							type="image"
							src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif"
							name="submit"
							title="PayPal - The safer, easier way to pay online!"
							alt="Donate with PayPal button"
							className="my-2"
						/>
						<img
							alt=""
							src="https://www.paypal.com/en_GB/i/scr/pixel.gif"
							width="1"
							height="1"
						/>
					</form>
				</InfoBox>
			</main>
			<Footer />
		</div>
	);
}
