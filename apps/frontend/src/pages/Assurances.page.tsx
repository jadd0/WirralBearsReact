import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { Footer } from '@components/layout/Footer';

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

export default function AssurancesPage() {
	return (
		<div className="min-h-screen font-sans flex flex-col">
			<LogoBanner />
			<main className="flex-1 flex flex-col items-center px-4">
				<section className="w-full max-w-2xl text-center py-10">
					<h1 className="text-4xl font-extrabold mb-4 tracking-tight">
						Fully aligned with Basketball England
					</h1>
					<p className="text-lg text-gray-700 mb-6">
						We follow Basketball England’s guidance for safe operation. Our full
						policies—available on request—cover Transporting Children,
						Anti-Bullying, Supervision Ratios, Safeguarding, Social Media,
						Photography, Equality, Conduct, and more.
					</p>
				</section>
{/* 
				<div className="flex justify-center w-full mb-8">
					<img
						src="/images/AZ4A5625.jpg"
						alt="Coach Martin"
						className="w-full max-w-lg rounded-2xl shadow-xl object-cover"
					/>
				</div> 
				TODO: ADD IMAGE*/}

				<InfoBox
					title="Safeguarding Tips"
					className="w-full max-w-xl bg-gray-700"
				>
					<ul className="space-y-3">
						<li className="flex items-start">
							<CheckIcon />
							<span className="ml-2">
								If you notice sudden changes in your child's behaviour or have
								concerns, speak to a coach or our safeguarding officer, Tom
								Wilkinson.
							</span>
						</li>
						<li className="flex items-start">
							<CheckIcon />
							<span className="ml-2">
								Do not allow your child to share personal details with adults,
								and vice versa.
							</span>
						</li>
						<li className="flex items-start">
							<CheckIcon />
							<span className="ml-2">
								If giving or receiving lifts, ensure everyone feels safe and
								report any concerns to a coach or Tom Wilkinson.
							</span>
						</li>
						<li className="flex items-start">
							<CheckIcon />
							<span className="ml-2">
								Ensure your child is safe getting to and from sessions and is
								collected on time.
							</span>
						</li>
					</ul>
				</InfoBox>

				<h2 className="text-xl sm:text-2xl font-bold mt-10 mb-2 text-center">
					Social Media Use
				</h2>
				<section className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 mb-10">
					<p className="text-base sm:text-lg text-gray-700">
						Please encourage your child to use social media responsibly. If
						there are any issues, let us know. Young adults may say things
						online they wouldn’t in person—real-life respect comes first.
					</p>
				</section>
			</main>
			<Footer />
		</div>
	);
}
