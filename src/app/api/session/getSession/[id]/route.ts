import { NextResponse } from 'next/server';
import { sessionServices } from '@/server/services/session.services';

// Public endpoint - no auth required
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	try {
		const session = await sessionServices.getSession(id);

		if (session) {
			return NextResponse.json({ session });
		}
		return NextResponse.json({ message: 'Session not found' }, { status: 404 });
	} catch (error) {
		console.error('Error fetching session:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch session',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
