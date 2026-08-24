import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET() {
	try {
		const statistics = await gamesServices.getGamesStatistics();
		return NextResponse.json({ statistics });
	} catch (error) {
		console.error('Error fetching games statistics:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch games statistics',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
