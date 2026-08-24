import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { blogServices } from '@/server/services/blog.services';

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
		const result = await blogServices.deleteBlog(id);

		if (result) {
			return NextResponse.json({ message: 'Blog deleted successfully' });
		}
		return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
	} catch (error) {
		console.error('Error deleting blog:', error);
		return NextResponse.json({ message: 'Failed to delete blog' }, { status: 500 });
	}
}
