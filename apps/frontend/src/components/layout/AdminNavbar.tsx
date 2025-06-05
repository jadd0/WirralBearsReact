import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Navigation items
const navLinks = [
	{ to: '/', label: 'Wirral Bears', key: 'wirralBears' },
	{ to: '/admin', label: 'Dashboard', key: 'dashboard' },
	{ to: '/admin/blog/createPost', label: 'Create Post', key: 'createPost' },
	{ to: '/admin/blog/editPost', label: 'Edit Post', key: 'editPost' },
	{ to: '/admin/image', label: 'Images', key: 'images' },
	{ to: '/admin/coaches/create', label: 'Create Coach', key: 'createCoach' },
	{ to: '/admin/coaches/edit', label: 'Edit Coach', key: 'editCoach' },
];

export function AdminNavbar() {
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
				</nav>
			</div>
			{/* UnderNav */}
			<div className="hidden md:block sticky top-[0px] z-40 w-full h-[37px] backdrop-blur-sm" />

			{/* Mobile Navbar */}
			<nav className="md:hidden bg-[#333] sticky top-0 z-50">
				<div className="flex items-center justify-between px-4 py-2">
					<span className="text-white font-bold text-lg">Menu</span>
					<button
						className="flex flex-col h-10 w-10 justify-center items-center group"
						onClick={() => setOpen((o) => !o)}
						aria-label="Toggle menu"
					>
						{/* Hamburger lines */}
						<div
							className={`h-1 w-8 my-1 rounded bg-white transition-all duration-300 
                ${open ? 'rotate-[-45deg] translate-y-3' : ''}`}
						/>
						<div
							className={`h-1 w-8 my-1 rounded bg-white transition-all duration-300 
                ${open ? 'opacity-0' : ''}`}
						/>
						<div
							className={`h-1 w-8 my-1 rounded bg-white transition-all duration-300 
                ${open ? 'rotate-[45deg] -translate-y-3' : ''}`}
						/>
					</button>
				</div>
				<div
					className={`overflow-hidden transition-all duration-300 
            ${open ? 'max-h-[500px]' : 'max-h-0'} bg-[#bbbabaa4]`}
				>
					<div className="flex flex-col items-center py-2">
						{navLinks.map((link) => (
							<NavLink
								key={link.key}
								to={link.to}
								className={({ isActive }) =>
									`block w-full text-center py-3 text-lg font-bold transition-colors duration-200 
                  ${
										isActive
											? 'bg-black text-white'
											: 'text-black hover:bg-black hover:text-gray-300'
									}`
								}
							>
								{link.label}
							</NavLink>
						))}
						<a
							href="https://wirral-bears.myspreadshop.co.uk"
							target="_blank"
							rel="noopener noreferrer"
							className="block w-full text-center py-3 text-lg font-bold text-black hover:bg-black hover:text-gray-300"
						>
							Shop
						</a>
					</div>
				</div>
			</nav>
		</>
	);
}
