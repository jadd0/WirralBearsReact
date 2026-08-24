import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { blogServices } from '@/server/services/blog.services';
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

		const blogData: BlogData = { elements };

		const newBlog = await blogServices.createBlog(authorId, blogData, files);

		return NextResponse.json(
			{
				blog: newBlog,
				id: newBlog.id,
				message: 'Blog created successfully',
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating blog:', error);
		return NextResponse.json(
			{
				message: 'Failed to create blog',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
