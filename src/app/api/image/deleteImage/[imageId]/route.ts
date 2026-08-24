import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { imageServices } from '@/server/services/image.services';

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ imageId: string }> }
) {
	const session = await auth();

	if (!session?.user) {
		return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
	}
	if (!session.user.isAdmin) {
		return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
	}

	const { imageId } = await params;

	if (!imageId) {
		return NextResponse.json({ message: 'No imageId' }, { status: 400 });
	}

	try {
		const result = await imageServices.deleteImage(imageId);

		if (result) {
			return NextResponse.json({ message: 'Image deleted successfully' });
		}
		return NextResponse.json({ message: 'Image not found' }, { status: 404 });
	} catch (error) {
		console.error('Error deleting image:', error);
		return NextResponse.json(
			{
				message: 'Failed to delete image',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
