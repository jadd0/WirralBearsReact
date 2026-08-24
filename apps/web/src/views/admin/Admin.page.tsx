'use client';

import { useSession } from 'next-auth/react';

export default function AdminPage() {
	const { data: session } = useSession();

	return (
		<div className="min-h-dvh min-w-full font-sans flex flex-col items-center">
			<section className="w-full max-w-2xl text-center py-10">
				<h1 className="text-4xl font-extrabold tracking-tight text-center mt-5 mb-4">
					Admin Page
				</h1>
				<p className="text-lg text-gray-700 mb-6">
					Welcome, {session?.user?.name}. To customise the site in any way,
					please click on the destination through the navbar.
				</p>
			</section>
		</div>
	);
}