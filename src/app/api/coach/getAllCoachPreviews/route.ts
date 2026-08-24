import { NextResponse } from 'next/server';
import { coachServices } from '@/server/services/coach.services';

// Public endpoint - no auth required
export async function GET() {
	const coaches = await coachServices.getAllCoaches();
	return NextResponse.json({ coaches });
}
