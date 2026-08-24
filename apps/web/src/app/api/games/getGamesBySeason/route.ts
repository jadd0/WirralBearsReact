import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const gender = searchParams.get('gender') ?? undefined;

	try {
		const gamesBySeason = await gamesServices.getGamesBySeason(gender);
		return NextResponse.json({ gamesBySeason });
	} catch (error) {
		console.error('Error fetching games by season:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch games by season',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
