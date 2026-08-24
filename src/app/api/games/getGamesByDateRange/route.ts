import { NextResponse } from 'next/server';
import { gamesServices } from '@/server/services/games.services';

// Public endpoint - no auth required
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');

	if (!startDate || !endDate) {
		return NextResponse.json(
			{ message: 'Start date and end date are required' },
			{ status: 400 }
		);
	}

	try {
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			return NextResponse.json({ message: 'Invalid date format' }, { status: 400 });
		}

		const games = await gamesServices.getGamesByDateRange(start, end);
		return NextResponse.json({ games });
	} catch (error) {
		console.error('Error fetching games by date range:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch games by date range',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
