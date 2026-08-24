import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const limitParam = searchParams.get('limit');
	const gameLimit = limitParam ? parseInt(limitParam) : 10;

	if (isNaN(gameLimit) || gameLimit <= 0) {
		return NextResponse.json({ message: 'Invalid limit parameter' }, { status: 400 });
	}

	try {
		const games = await gamesServices.getRecentGames(gameLimit);
		return NextResponse.json({ games });
	} catch (error) {
		console.error('Error fetching recent games:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch recent games',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
