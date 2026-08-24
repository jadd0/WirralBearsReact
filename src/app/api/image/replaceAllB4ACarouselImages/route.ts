import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { imageServices } from '@/server/services/image.services';
import type { CarouselImageInsert } from '@/server/repositories/images.repo';

export async function PUT(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
	}
	if (!session.user.isAdmin) {
		return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
	}

	try {
		// The client sends the array of {imageId, key} directly, not wrapped
		// in an envelope (see image.api.ts: `data: images`).
		const items = await request.json();

		if (!Array.isArray(items)) {
			return NextResponse.json(
				{ message: 'Invalid images data - expected array' },
				{ status: 400 }
			);
		}

		const result = await imageServices.replaceAllB4ACarouselImages(
			items as CarouselImageInsert[]
		);

		if (result) {
			return NextResponse.json({
				message: `Successfully replaced B4A carousel with ${items.length} images`,
			});
		}
		return NextResponse.json(
			{ message: 'Failed to replace B4A carousel images' },
			{ status: 500 }
		);
	} catch (error) {
		console.error('Error replacing B4A carousel images:', error);
		return NextResponse.json(
			{
				message: 'Failed to replace B4A carousel images',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
