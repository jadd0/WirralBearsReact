import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { blogServices } from '@/server/services/blog.services';
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

		const blogData: BlogData = { elements };

		const updatedBlog = await blogServices.updateBlog(id, authorId, blogData, files);

		if (updatedBlog) {
			return NextResponse.json({
				blog: updatedBlog,
				id: updatedBlog.id,
				message: 'Blog updated successfully',
			});
		}

		return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
	} catch (error) {
		console.error('Error updating blog:', error);
		return NextResponse.json(
			{
				message: 'Failed to update blog',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
