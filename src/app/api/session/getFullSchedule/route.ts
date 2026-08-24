import { NextResponse } from 'next/server';
import { sessionServices } from '@/server/services/session.services';

// Public endpoint - no auth required
export async function GET() {
	try {
		const schedule = await sessionServices.getFullSchedule();
		return NextResponse.json({ schedule });
	} catch (error) {
		console.error('Error fetching schedule:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch schedule',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
