import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Navigation items
const navLinks = [
	{ to: '/ballforall', label: 'Ball 4 All', key: 'ballforall' },
	{ to: '/assurances', label: 'Assurance', key: 'assurances' },
	{
		to: '/aninclusiveapproach',
		label: 'An Inclusive Approach',
		key: 'aninclusiveapproach',
	},
	{ to: '/sessions', label: 'Sessions', key: 'sessions' },
	{ to: '/sponsorship', label: 'Sponsorship', key: 'sponsorship' },
	{ to: '/image/viewall', label: 'Gallery', key: 'gallery' },
	{ to: '/coaches', label: 'Coaches', key: 'coaches' },
	{ to: '/blog/blogs', label: 'Blogs', key: 'blogs' },
	{ to: '/games', label: 'Games', key: 'games' },
];

export function Navbar() {
	const [open, setOpen] = useState(false);
	const location = useLocation();

	// Auto-close mobile menu on route change
	useEffect(() => {
		setOpen(false);
	}, [location.pathname]);

	return (
		<>
			{/* Desktop Navbar */}
			<div className="hidden md:block sticky top-0 z-50 opacity-90">
				<nav className="bg-[#333] text-base h-[37px] flex items-center justify-center px-7 overflow-hidden">
					{navLinks.map((link) => (
						<NavLink
							key={link.key}
							to={link.to}
							className={
								'font-extralight px-4 py-2 transition-colors duration-200 text-[15px] text-gray-400 hover:text-white'
							}
						>
							{link.label}
						</NavLink>
					))}
					<a
						href="https://sixthmanbasketball.co.uk/wirral-bears"
						target="_blank"
						rel="noopener noreferrer"
						className={
							'font-extralight px-4 py-2 transition-colors duration-200 text-[15px] text-gray-400 hover:text-white'
						}
					>
						Shop
					</a>
				</nav>
			</div>
			{/* UnderNav */}
			<div className="hidden md:block sticky top-[0px] z-40 w-full h-[37px] backdrop-blur-sm" />

			{/* Modern Mobile Navbar */}
			<nav className="md:hidden bg-[#333333] sticky top-0 z-50 shadow-lg mb-5">
				<div className="flex items-center justify-end px-6 py-4">
					<button
						className="flex flex-col h-12 w-12 justify-center items-center group rounded-lg hover:bg-[#ff0000]/10 transition-all duration-300"
						onClick={() => setOpen((o) => !o)}
						aria-label="Toggle menu"
					>
						{/* Modern Hamburger lines */}
						<div
							className={`h-0.5 w-7 my-1 rounded-full bg-white transition-all duration-500 ease-in-out
                ${open ? 'rotate-45 translate-y-2.5 bg-[#ff0000]' : ''}`}
						/>
						<div
							className={`h-0.5 w-7 my-1 rounded-full bg-white transition-all duration-500 ease-in-out
                ${open ? 'opacity-0 scale-0' : ''}`}
						/>
						<div
							className={`h-0.5 w-7 my-1 rounded-full bg-white transition-all duration-500 ease-in-out
                ${open ? '-rotate-45 -translate-y-2.5 bg-[#ff0000]' : ''}`}
						/>
					</button>
				</div>

				{/* Full Screen Mobile Menu */}
				<div
					className={`fixed inset-0 top-[72px] bg-[#d3d2d2] transition-all duration-500 ease-in-out
            ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
				>
					<div className="flex flex-col h-full justify-center items-center space-y-2 px-8">
						{navLinks.map((link, index) => (
							<NavLink
								key={link.key}
								to={link.to}
								className={({ isActive }) =>
									`block w-full text-center py-4 px-6 text-xl font-medium rounded-xl transition-all duration-300 transform hover:scale-105
                  ${
										isActive
											? 'bg-[#ff0000] text-white shadow-lg'
											: 'text-black hover:bg-[#ff0000]/10 hover:text-black border border-black/20'
									}`
								}
								style={{
									animationDelay: open ? `${index * 0.1}s` : '0s',
									animation: open ? 'slideInUp 0.6s ease-out forwards' : 'none',
								}}
							>
								{link.label}
							</NavLink>
						))}
						<a
							href="https://sixthmanbasketball.co.uk/wirral-bears"
							target="_blank"
							rel="noopener noreferrer"
							className="block w-full text-center py-4 px-6 text-xl font-medium rounded-xl transition-all duration-300 transform hover:scale-105 text-black hover:bg-[#ff0000]/10 hover:text-black border border-black/20 mt-4"
							style={{
								animationDelay: open ? `${navLinks.length * 0.1}s` : '0s',
								animation: open ? 'slideInUp 0.6s ease-out forwards' : 'none',
							}}
						>
							Shop
						</a>
					</div>
				</div>
			</nav>

			{/* CSS Animation */}
			<style jsx>{`
				@keyframes slideInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</>
	);
}
