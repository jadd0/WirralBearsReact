import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { Footer } from '@components/layout/Footer';

export default function BallForAllPage() {
	return (
		<div className="min-h-screen font-sans flex flex-col">
			<LogoBanner />
			<main className="flex-1 flex flex-col items-center px-4">
				<h1 className="text-3xl sm:text-4xl font-extrabold my-6 text-center text-gray-900">
					We ask for one commitment – Ball for All
				</h1>
				<section className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 mb-6">
					<p className="text-base sm:text-lg text-gray-700">
						If anyone (player or coach) wants to be involved in the youth club,
						they must commit to the Ball for All principles and hold everyone to
						account for them. They create great and enjoyable basketball.
						<br />
						<br />
						To join, a player must discuss these principles with the coaches and
						team-mates, sign them, and play by them.
						<br />
						<br />
						No player will be asked to leave the club unless they do not follow
						these principles:
					</p>
				</section>
				<InfoBox className="w-full max-w-xl">
					<ol className="text-left space-y-2 list-decimal list-inside text-base sm:text-lg">
						<li>
							<span className="font-semibold">Joy</span> – it's the essence of
							success
						</li>
						<li>
							<span className="font-semibold">Positivity</span> – positive
							mental attitude is key
						</li>
						<li>
							<span className="font-semibold">Respect</span> – we treat others
							like we would like to be treated
						</li>
						<li>
							<span className="font-semibold">
								Equal Focus and Equal Minutes
							</span>{' '}
							– we are all part of this team
						</li>
						<li>
							<span className="font-semibold">Dedication and Effort</span> –
							it's how we get better
						</li>
						<li>
							<span className="font-semibold">Growth</span> – it's where we are
							now, and where we will be in the future
						</li>
						<li>
							<span className="font-semibold">Pass</span> – because ball hogging
							ruins the game
						</li>
						<li>
							<span className="font-semibold">Defence</span> – it wins
							championships
						</li>
						<li>
							<span className="font-semibold">Shoot</span> – when it's good and
							within range. The only miss is not taking a good shot
						</li>
						<li>
							<span className="font-semibold">Play</span> – together as a team.
						</li>
					</ol>
				</InfoBox>
				<p className="text-lg sm:text-xl font-semibold my-6 text-center text-gray-800">
					Because it's ball for all, not just some.
				</p>
			</main>
			<Footer />
		</div>
	);
}
