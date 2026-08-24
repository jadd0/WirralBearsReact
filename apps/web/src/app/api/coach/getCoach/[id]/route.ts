import { NextResponse } from 'next/server';
import { coachServices } from '@/server/services/coach.services';

// Public endpoint - no auth required
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	try {
		const coach = await coachServices.getCoachById(id);
		return NextResponse.json({ coach });
	} catch (error) {
		console.error('Error fetching coach:', error);
		return NextResponse.json({ message: 'Coach not found' }, { status: 404 });
	}
}
