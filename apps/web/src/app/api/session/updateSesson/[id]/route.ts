import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sessionServices } from '@/server/services/session.services';

// NOTE: path keeps the upstream `updateSesson` typo (not `updateSession`) —
// this must match apps/web/src/api/session.api.ts's `updateSession()` call
// exactly, since a later migration task repoints the frontend at these
// routes without changing its own code.
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
	}
	if (!session.user.isAdmin) {
		return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
	}

	const { id } = await params;

	try {
		// Mirrors the old backend controller: this existence check is a no-op
		// in practice because sessionServices.getSession() throws (rather than
		// returning null) when the session isn't found, so a missing id falls
		// through to the catch block below as a 500, same as upstream.
		const existingSession = await sessionServices.getSession(id);

		if (!existingSession) {
			return NextResponse.json(
				{ message: `No such session with id ${id}` },
				{ status: 404 }
			);
		}

		const updates = await request.json();
		const updatedSession = await sessionServices.updateSession(id, updates);
		return NextResponse.json({
			session: updatedSession,
			message: 'Session updated successfully',
		});
	} catch (error) {
		console.error('Error updating session:', error);
		return NextResponse.json(
			{
				message: 'Failed to update session',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
