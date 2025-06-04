export function Footer() {
	return (
		<footer className="bg-neutral-900 text-white mt-12">
			<div className="flex flex-col md:flex-row justify-between items-start max-w-6xl mx-auto py-10 px-4 gap-8">
				{/* Contact Section */}
				<div className="mb-8 md:mb-0 w-full md:w-1/3">
					<h3 className="font-bold mb-3 text-red-500">Get In Touch</h3>
					<ul className="space-y-2">
						<li>
							<a
								href="mailto:jaddalkwork@gmail.com"
								className="hover:text-red-400 transition-colors"
							>
								Website Designer: Jadd (jaddalkwork@gmail.com)
							</a>
						</li>
						<li>
							<a
								href="mailto:icona.photo.service@gmail.com"
								className="hover:text-red-400 transition-colors"
							>
								Photographer: Giannis (icona.photo.service@gmail.com)
							</a>
						</li>
						<li>
							<a
								href="mailto:wirralbears@gmail.com"
								className="hover:text-red-400 transition-colors"
							>
								Club (wirralbears@gmail.com)
							</a>
						</li>
					</ul>
				</div>

				{/* Logo Section */}
				<div className="flex justify-center items-center w-full md:w-1/3 mb-8 md:mb-0">
					<img
						src="/images/bears big red.png"
						alt="Bears logo"
						className="w-32 md:w-40"
					/>
				</div>

				{/* Info & Social Section */}
				<div className="w-full md:w-1/3">
					<h3 className="font-bold mb-3 text-red-500">More Info</h3>
					<ul className="space-y-2">
						<li>
							<a
								href="https://goo.gl/maps/2dHvRTcbWPFoZLoT6"
								className="hover:text-red-400 transition-colors"
							>
								Woodchurch Location
							</a>
						</li>
						<li>
							<a
								href="https://goo.gl/maps/Zs2cBJ1htbrRkEcY6"
								className="hover:text-red-400 transition-colors"
							>
								Neston Location
							</a>
						</li>
					</ul>
					<div className="flex space-x-4 mt-4">
						<a href="https://facebook.com/WirralBears/" aria-label="Facebook">
							<img
								src="/images/facebook.png"
								alt="Facebook"
								className="w-8 hover:opacity-80 transition-opacity"
							/>
						</a>
						<a
							href="https://instagram.com/wirral_bears_basketball_club?r=nametag"
							aria-label="Instagram"
						>
							<img
								src="/images/instagram.png"
								alt="Instagram"
								className="w-8 hover:opacity-80 transition-opacity"
							/>
						</a>
					</div>
				</div>
			</div>

			{/* Sponsors Row */}
			<div className="bg-neutral-800 py-6">
				<div className="flex flex-col sm:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
					<a
						href="https://taylorbrownsolicitors.com"
						target="_blank"
						rel="noopener noreferrer"
						className="flex justify-center items-center w-40 h-20 bg-white rounded-lg shadow hover:scale-105 transition-transform"
					>
						<img
							src="/images/taylor Brown 1.png"
							alt="Taylor Brown Solicitors"
							className="w-full h-full object-contain p-2"
						/>
					</a>
					<a
						href="https://www.chesterfinancial.co.uk"
						target="_blank"
						rel="noopener noreferrer"
						className="flex justify-center items-center w-40 h-20 bg-white rounded-lg shadow hover:scale-105 transition-transform"
					>
						<img
							src="/images/Chester Financial.png"
							alt="Chester Financial"
							className="w-full h-full object-contain p-2"
						/>
					</a>
				</div>
			</div>

			{/* Copyright */}
			<div className="text-center text-sm text-gray-400 py-4 bg-neutral-900">
				&copy; {new Date().getFullYear()} Wirral Bears Basketball Club. All
				rights reserved.
			</div>
		</footer>
	);
}
