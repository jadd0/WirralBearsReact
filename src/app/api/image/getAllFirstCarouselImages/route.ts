import { NextResponse } from 'next/server';
import { imageServices } from '@/server/services/image.services';

// Public endpoint - no auth required
// Returns a bare array: GalleryCarousel and CarouselImageSelector expect
// CarouselImage[] directly, not wrapped in an envelope.
export async function GET() {
	try {
		const result = await imageServices.getAllFirstCarouselImages();
		return NextResponse.json(result);
	} catch (error) {
		console.error('Error fetching first carousel images:', error);
		return NextResponse.json(
			{
				message: 'Failed to fetch first carousel images',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
