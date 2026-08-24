import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { coachServices } from '@/server/services/coach.services';
import { BlogData } from '@/lib/types';

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

	const authorId = session.user.id;
	const { id } = await params;

	try {
		const formData = await request.formData();

		// Parse the elements from the form data
		const elementsRaw = formData.get('elements');
		const elements = elementsRaw ? JSON.parse(elementsRaw as string) : [];

		// Get the uploaded files - fields are named `file_<elementIndex>`, sent
		// in the same order the frontend appended them.
		const files = Array.from(formData.entries())
			.filter(([, value]) => value instanceof File)
			.map(([, value]) => value as File);

		const coachData: BlogData = { elements };

		const updatedCoach = await coachServices.updateCoach(
			id,
			authorId,
			coachData,
			files
		);

		if (updatedCoach) {
			return NextResponse.json({
				coach: updatedCoach,
				id: updatedCoach.id,
				message: 'Coach updated successfully',
			});
		}

		return NextResponse.json({ message: 'Coach not found' }, { status: 404 });
	} catch (error) {
		console.error('Error updating coach:', error);
		return NextResponse.json(
			{
				message: 'Failed to update coach',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
