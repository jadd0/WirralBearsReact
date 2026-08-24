import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { coachServices } from '@/server/services/coach.services';

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
		const file = formData.get('image');

		if (!file || !(file instanceof File)) {
			return NextResponse.json({ message: 'No image file provided' }, { status: 400 });
		}

		const result = await coachServices.uploadSingleImage(authorId, file);

		return NextResponse.json({
			url: result.url,
			message: 'Image uploaded successfully',
		});
	} catch (error) {
		console.error('Error uploading image:', error);
		return NextResponse.json(
			{
				message: 'Failed to upload image',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
