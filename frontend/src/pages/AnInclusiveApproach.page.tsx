import { LogoBanner } from '@components/layout/LogoBanner';
import { InfoBox } from '@components/layout/InfoBox';
import { Footer } from '@components/layout/Footer';

export default function AnInclusiveApproachPage() {
	return (
		<div className="bg-gray-200 min-h-screen font-sans">
			<LogoBanner />
			<h1 className="text-2xl font-bold my-4">
				We tailor our approach to the young player
			</h1>
			<div className="max-w-3xl mx-auto my-4">
				<div className="bg-white rounded p-4 mb-4">
					If a young player enjoys disciplined, challenging training and
					competitive games, we provide that.
					<br />
					If a young player enjoys less formal, more relaxed training and games,
					we provide that. Both are equal to us, and we provide a bridge between
					the two.
				</div>
				<div className="bg-white rounded p-4">
					We allow young players to find their own path and place within the
					game; and will always put their best interests at heart. A lot of
					players are put off at first by activities which are, in their eyes,
					too competitive. Our key is working with Young People first, and
					Basketball second.
				</div>
			</div>
			<InfoBox>
				<strong>We have set up a funding and assurance model that:</strong>
				<ul className="list-disc list-inside text-left mt-2">
					<li>Ensures high quality coaching</li>
					<li>
						Enables participation at all ability levels, including matches
					</li>
					<li>
						Aims for a consistent coach per group, with focused coaching on
						specific areas
					</li>
				</ul>
			</InfoBox>
			<div className="flex justify-center my-8">
				<img
					src="/images/AZ4A5789.jpg"
					alt="High five"
					className="w-2/3 md:w-1/2 rounded-lg shadow"
				/>
			</div>
			<h2 className="text-xl font-bold mt-8">Our approach and background</h2>
			<div className="flex flex-col md:flex-row justify-center gap-4 my-4">
				<div className="bg-white rounded p-4 flex-1">
					We play half-court, have experienced coaches, often have teachers as
					coaches and have full coaching development and safeguarding programs.
					We build from the bottom-up, with no favouritism or over focus on
					better players. We don't allow domination of other players and always
					look to equalise games and competitions.
				</div>
				<div className="bg-white rounded p-4 flex-1">
					We actively encourage sponsorship or donations, and all our finances
					are transparent, with all monies going towards funding the junior
					program. We have sponsors for specific aspects of the club e.g. most
					improved player, and if you or your company would like to help, please
					get in touch.
				</div>
				<div className="bg-white rounded p-4 flex-1">
					We can really make a difference with the help and guarantee no
					favouritism towards your child. We also have an associate program,
					where young players who need some extra help can work for the club in
					lieu of fees and kit costs. Please get in touch if you would like to
					talk about this.
				</div>
			</div>
			<Footer />
		</div>
	);
}
