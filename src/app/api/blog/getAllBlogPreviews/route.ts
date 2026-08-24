import { NextResponse } from 'next/server';
import { blogServices } from '@/server/services/blog.services';

// Public endpoint - no auth required
export async function GET() {
	const blogs = await blogServices.getAllBlogs();
	return NextResponse.json({ blogs });
}
