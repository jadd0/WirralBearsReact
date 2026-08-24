import { NextResponse } from 'next/server';
import { imageServices } from '@/server/services/image.services';

// Public endpoint - no auth required
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ cursor: string }> }
) {
	const { cursor } = await params;

	if (!cursor) {
		return NextResponse.json(
			{ message: 'No cursor for pagination' },
			{ status: 400 }
		);
	}

	const cursorNumber = parseInt(cursor, 10);

	if (Number.isNaN(cursorNumber)) {
		return NextResponse.json(
			{ message: 'Invalid cursor for pagination' },
			{ status: 400 }
		);
	}

	try {
		const result = await imageServices.getAllImages(cursorNumber);
		return NextResponse.json({ ...result });
	} catch (error) {
		console.error('Error fetching images:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch images',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
