import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET() {
	try {
		const seasons = await gamesServices.getAllSeasons();
		return NextResponse.json({ seasons });
	} catch (error) {
		console.error('Error fetching seasons:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch seasons',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
