import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { gamesServices } from '@/server/services/games.services';
import { GameInsert } from '@/db/schema';

export async function PUT(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
	}
	if (!session.user.isAdmin) {
		return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
	}

	try {
		const body = await request.json();
		const { games } = body;

		if (!games || !Array.isArray(games)) {
			return NextResponse.json(
				{ message: 'Invalid games data - expected array' },
				{ status: 400 }
			);
		}

		const success = await gamesServices.replaceAllGames(games as GameInsert[]);

		if (success) {
			return NextResponse.json({
				message: `Successfully replaced all games with ${games.length} new games`,
			});
		}
		return NextResponse.json({ message: 'Failed to replace games' }, { status: 500 });
	} catch (error) {
		console.error('Error replacing all games:', error);
		return NextResponse.json(
			{
				message: 'Failed to replace games',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
