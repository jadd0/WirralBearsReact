import { NextResponse } from 'next/server';
import { sessionServices } from '@/server/services/session.services';

// Public endpoint - no auth required
export async function GET() {
	try {
		const sessions = await sessionServices.getAllSessions();
		return NextResponse.json({ sessions });
	} catch (error) {
		console.error('Error fetching sessions:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch sessions',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
