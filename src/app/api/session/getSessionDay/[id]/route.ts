import { NextResponse } from 'next/server';
import { sessionServices } from '@/server/services/session.services';

// Public endpoint - no auth required
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	try {
		const sessionDay = await sessionServices.getSessionDay(id);
		return NextResponse.json({ sessionDay });
	} catch (error) {
		console.error('Error fetching session day:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch session day',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
