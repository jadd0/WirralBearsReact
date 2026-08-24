import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	try {
		const game = await gamesServices.getGameById(id);

		if (game) {
			return NextResponse.json({ game });
		}
		return NextResponse.json({ message: 'Game not found' }, { status: 404 });
	} catch (error) {
		console.error('Error fetching game:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch game',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
