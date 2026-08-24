import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ seasonId: string }> }
) {
	const { seasonId } = await params;

	try {
		const games = await gamesServices.getGamesBySeasonId(seasonId);
		return NextResponse.json({ games });
	} catch (error) {
		console.error('Error fetching games for season:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch games for season',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
