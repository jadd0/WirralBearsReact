import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sessionServices } from '@/server/services/session.services';

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
	}
	if (!session.user.isAdmin) {
		return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
	}

	try {
		const sessionData = await request.json();

		const newSession = await sessionServices.createSession(sessionData);
		return NextResponse.json(
			{
				session: newSession,
				message: 'Session created successfully',
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating session:', error);
		return NextResponse.json(
			{
				message: 'Failed to create session',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
