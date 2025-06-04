import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { Footer } from '@components/layout/Footer';

export default function AssurancesPage() {
	return (
		<div className="min-h-screen font-sans flex flex-col">
			<LogoBanner />
			<main className="flex-1 flex flex-col items-center px-4">
				<h1 className="text-xl sm:text-xl font-extrabold my-6 text-center text-gray-900">
					We are a fully aligned club with Basketball England and follow their
					guidance on how to operate safely.
				</h1>
				<section className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 mb-6">
					<p className="text-base sm:text-lg text-gray-700">
						We have full policies on all areas, which are available on request.
						We just did not want to overwhelm you with this pack. These policies
						are:{' '}
						<span className="font-semibold">
							Transporting Children Guidelines, Anti-Bullying Charter,
							Anti-Bullying Policy, Supervision Ratios, Safeguarding Policy,
							Social Media Policy, Photography and Video Guidance, Equality
							Policy, Equal Opportunities Policy, Coach and Parent Conduct
							Policy.
						</span>
					</p>
				</section>
				<InfoBox
					title="Please follow these safeguarding tips:"
					className="w-full max-w-xl"
				>
					<ul className="list-disc list-inside text-left space-y-2 text-base sm:text-lg">
						<li>
							If you notice any sudden change in your child's behaviour and have
							any concerns, please speak to a coach or our safeguarding officer,
							Tom Wilkinson.
						</li>
						<li>
							Don't allow your child to share their personal details with any
							adults, and don't let adults share them with your child.
						</li>
						<li>
							If you are giving lifts to other children, or your child is
							getting a lift, please make sure you feel they are safe. If you
							notice any sudden changes in behaviour from your child or another
							child, please speak to a coach or our safeguarding officer, Tom
							Wilkinson.
						</li>
						<li>
							Please ensure your child is safe getting to and coming home from
							the session. Please also make sure your child is collected on
							time.
						</li>
					</ul>
				</InfoBox>
				<h2 className="text-xl sm:text-2xl font-bold mt-10 mb-2 text-center text-gray-800">
					Social Media Use
				</h2>
				<section className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 mb-10">
					<p className="text-base sm:text-lg text-gray-700">
						Please encourage your child to use social media responsibly. If
						there are any issues, please let us know. Often young adults will
						say things on social media which they would not say in real life, so
						it's probably best to keep it to real life.
					</p>
				</section>
			</main>
			<Footer />
		</div>
	);
}
