export function Footer() {
	return (
		<footer className="bg-neutral-800 text-white mt-12">
			<div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto py-8 px-4">
				<div className="mb-6 md:mb-0 w-full md:w-1/3">
					<h3 className="font-bold mb-2">Get In Touch</h3>
					<ul>
						<li>
							<a
								href="mailto:jaddalkwork@gmail.com"
								className="hover:underline"
							>
								Website Designer: Jadd (jaddalkwork@gmail.com)
							</a>
						</li>
						<li>
							<a
								href="mailto:icona.photo.service@gmail.com"
								className="hover:underline"
							>
								Photographer: Giannis (icona.photo.service@gmail.com)
							</a>
						</li>
						<li>
							<a
								href="mailto:wirralbears@gmail.com"
								className="hover:underline"
							>
								Club (wirralbears@gmail.com)
							</a>
						</li>
					</ul>
				</div>
				<div className="flex justify-center items-center w-full md:w-1/3">
					<img
						src="/images/bears big red.png"
						alt="Bears logo"
						className="w-2/3 md:w-1/2"
					/>
				</div>
				<div className="w-full md:w-1/3">
					<h3 className="font-bold mb-2">More Info</h3>
					<ul>
						<li>
							<a
								href="https://goo.gl/maps/2dHvRTcbWPFoZLoT6"
								className="hover:underline"
							>
								Woodchurch Location
							</a>
						</li>
						<li>
							<a
								href="https://goo.gl/maps/Zs2cBJ1htbrRkEcY6"
								className="hover:underline"
							>
								Neston Location
							</a>
						</li>
					</ul>
					<div className="flex space-x-4 mt-4">
						<a href="https://facebook.com/WirralBears/">
							<img src="/images/facebook.png" alt="Facebook" className="w-8" />
						</a>
						<a href="https://instagram.com/wirral_bears_basketball_club?r=nametag">
							<img
								src="/images/instagram.png"
								alt="Instagram"
								className="w-8"
							/>
						</a>
					</div>
				</div>
			</div>
			<div className="flex justify-center gap-8 py-4 sponsorsDiv">
				<a
					href="https://taylorbrownsolicitors.com"
					className="w-1/4 md:w-1/6 flex justify-center"
				>
					<img
						src="/images/taylor Brown 1.png"
						alt="Taylor Brown Solicitors"
						className="w-full max-w-xs"
					/>
				</a>
				<a
					href="https://www.chesterfinancial.co.uk"
					className="w-1/4 md:w-1/6 flex justify-center"
				>
					<img
						src="/images/Chester Financial.png"
						alt="Chester Financial"
						className="w-full max-w-xs"
					/>
				</a>
			</div>
		</footer>
	);
}
