import { NextResponse } from 'next/server';
import { blogServices } from '@/server/services/blog.services';

// Public endpoint - no auth required
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	try {
		const blog = await blogServices.getBlogById(id);
		return NextResponse.json({ blog });
	} catch (error) {
		console.error('Error fetching blog:', error);
		return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
	}
}
