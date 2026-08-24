import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sessionServices } from '@/server/services/session.services';

export async function DELETE(
	_request: Request,
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
		await sessionServices.deleteSession(id);
		return NextResponse.json({ message: 'Session deleted successfully' });
	} catch (error) {
		console.error('Error deleting session:', error);
		return NextResponse.json(
			{
				message: 'Failed to delete session',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
