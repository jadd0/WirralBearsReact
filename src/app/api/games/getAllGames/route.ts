import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET() {
	try {
		const games = await gamesServices.getAllGames();
		return NextResponse.json({ games });
	} catch (error) {
		console.error('Error fetching games:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch games',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
