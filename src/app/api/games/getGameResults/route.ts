import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const seasonId = searchParams.get('seasonId') ?? undefined;
	const gender = searchParams.get('gender') ?? undefined;

	try {
		const results = await gamesServices.getGameResults(seasonId, gender);
		return NextResponse.json({ results });
	} catch (error) {
		console.error('Error calculating game results:', error);
		return NextResponse.json(
			{
				message: 'Failed to calculate game results',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
