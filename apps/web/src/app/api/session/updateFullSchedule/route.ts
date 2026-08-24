import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sessionServices } from '@/server/services/session.services';

export async function PUT(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
	}
	if (!session.user.isAdmin) {
		return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
	}

	try {
		const schedule = await request.json();

		if (!schedule) {
			return NextResponse.json(
				{ message: 'No schedule provided to update' },
				{ status: 400 }
			);
		}

		const result = await sessionServices.updateFullSchedule(schedule);
		return NextResponse.json({ success: result });
	} catch (error) {
		console.error('Error trying to update session schedule:', error);
		return NextResponse.json(
			{
				message: 'Error trying to update session schedule',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
