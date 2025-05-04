import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { Footer } from '@components/layout/Footer';

export default function BallForAllPage() {
	return (
		<div className="bg-gray-200 min-h-screen font-sans">
			<LogoBanner />
			<h1 className="text-2xl font-bold my-4">
				We ask for one commitment – Ball for All
			</h1>
			<div className="container mx-auto my-4">
				<p>
					If anyone (player or coach) wants to be involved in the youth club,
					they must commit to the Ball for All principles and hold everyone to
					account for them. They create great and enjoyable basketball.
					<br />
					To join, a player must discuss these principles with the coaches and
					team-mates, sign them, and play by them.
					<br />
					No player will be asked to leave the club unless they do not follow
					these principles:
				</p>
			</div>
			<InfoBox>
				<div className="text-left space-y-2">
					<div>1) Joy – it's the essence of success</div>
					<div>2) Positivity – positive mental attitude is key</div>
					<div>
						3) Respect – we treat others like we would like to be treated
					</div>
					<div>
						4) Equal Focus and Equal Minutes – we are all part of this team
					</div>
					<div>5) Dedication and effort – It's how we get better</div>
					<div>
						6) Growth – It's where we are now, and where we will be in the
						future
					</div>
					<div>7) Pass – because ball hogging ruins the game</div>
					<div>8) Defence – It wins championships</div>
					<div>
						9) Shoot – when it's good and within range. The only miss is not
						taking a good shot
					</div>
					<div>10) Play – together as a team.</div>
				</div>
			</InfoBox>
			<p className="text-lg font-semibold my-4">
				Because it's ball for all, not just some.
			</p>
			<Footer />
		</div>
	);
}
