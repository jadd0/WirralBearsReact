import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ gender: string }> }
) {
	const { gender } = await params;

	try {
		const games = await gamesServices.getGamesByGender(gender);
		return NextResponse.json({ games });
	} catch (error) {
		console.error(`Error fetching games for gender ${gender}:`, error);
		return NextResponse.json(
			{
				message: 'Failed to fetch games by gender',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
