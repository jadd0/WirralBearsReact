import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { blogServices } from '@/server/services/blog.services';

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

		// Fields are named `images`, sent as repeated FormData entries.
		const files = formData
			.getAll('images')
			.filter((value): value is File => value instanceof File);

		if (files.length === 0) {
			return NextResponse.json({ message: 'No image files provided' }, { status: 400 });
		}

		// Parse alt texts if provided (optional)
		let altTexts: string[] | undefined;
		const altTextsRaw = formData.get('altTexts');
		if (altTextsRaw) {
			try {
				altTexts = JSON.parse(altTextsRaw as string);
			} catch {
				return NextResponse.json(
					{ message: 'Invalid altTexts format. Must be a JSON array.' },
					{ status: 400 }
				);
			}
		}

		const result = await blogServices.uploadMultipleImages(files, authorId, altTexts);

		// Check if there were any per-image database insert failures
		if (result.failures.length > 0) {
			return NextResponse.json(
				{
					message: 'Some images uploaded successfully, but some failed',
					successes: result.successes,
					failures: result.failures,
					totalUploaded: result.totalUploaded,
					totalProcessed: result.totalProcessed,
				},
				{ status: 207 }
			);
		}

		return NextResponse.json({
			message: 'All images uploaded successfully',
			images: result.successes,
			totalUploaded: result.totalUploaded,
		});
	} catch (error) {
		console.error('Error uploading multiple images:', error);
		return NextResponse.json(
			{
				message: 'Failed to upload images',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
