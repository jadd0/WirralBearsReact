import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { coachServices } from '@/server/services/coach.services';
import { BlogData } from '@/lib/types';

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
	}
	if (!session.user.isAdmin) {
		return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
	}

	const authorId = session.user.id;

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

		const newCoach = await coachServices.createCoach(authorId, coachData, files);

		return NextResponse.json(
			{
				coach: newCoach,
				id: newCoach.id,
				message: 'Coach created successfully',
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating coach:', error);
		return NextResponse.json(
			{
				message: 'Failed to create coach',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
