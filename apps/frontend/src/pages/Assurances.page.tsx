import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { Footer } from '@components/layout/Footer';

export default function AssurancesPage() {
	return (
		<div className="bg-gray-200 min-h-screen font-sans">
			<LogoBanner />
			<h1 className="text-2xl font-bold my-4">
				We are a fully aligned club with Basketball England and follow their
				guidance on how to operate safely.
			</h1>
			<div className="w-full flex justify-center my-4">
				<p className="max-w-3xl p-4">
					We have full policies on all areas, which are available on request. We
					just did not want to overwhelm you with this pack. These policies are:
					Transporting Children Guidelines, Anti-Bullying Charter, Anti-Bullying
					Policy, Supervision Ratios, Safeguarding Policy, Social Media Policy,
					Photography and Video Guidance, Equality Policy, Equal Opportunities
					Policy, Coach and Parent Conduct Policy.
				</p>
			</div>
			<div className="flex justify-center">
				<img
					src="/images/AZ4A5625.jpg"
					alt="Coach Martin"
					className="w-11/12 md:w-2/3 rounded-lg shadow"
				/>
			</div>
			<InfoBox title="Please follow these safeguarding tips:" className="mt-8">
				<ul className="list-disc list-inside text-left space-y-2">
					<li>
						If you notice any sudden change in your child's behaviour and have
						any concerns please speak to a coach or our safeguarding officer,
						Tom Wilkinson.
					</li>
					<li>
						Don't allow your child to share their personal details with any
						adults, and don't let adults share them with your child.
					</li>
					<li>
						If you are giving lifts to other children, or your child is getting
						a lift, please make sure you feel they are safe and if you notice
						any sudden changes in behaviour from your child or another child,
						please speak to a coach or our safeguarding officer, Tom Wilkinson.
					</li>
					<li>
						Please ensure your child is safe getting to and coming home from the
						session. Please also make sure your child is collected on time.
					</li>
				</ul>
			</InfoBox>
			<h2 className="text-xl font-bold mt-8">Social Media Use</h2>
			<div className="w-full flex justify-center my-4">
				<p className="max-w-3xl p-4">
					Please encourage your child to use social media responsibly. If there
					are any issues, please let us know. Often young adults will say things
					on social media which they would not say in real-life, so it's
					probably best to keep it to real life.
				</p>
			</div>
			<Footer />
		</div>
	);
}
