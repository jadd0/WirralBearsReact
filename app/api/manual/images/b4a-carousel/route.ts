import { NextResponse } from "next/server";
import { imageRepository } from "@/repos";
import { auth } from "@/app/auth";

export async function GET() {
  console.log("hdfjlksdhjflkdshjflkjds")
  const images = await imageRepository.getAllB4ACarouselImages();
  return NextResponse.json(images);
}

export async function PUT(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  if (!Array.isArray(body)) {
    return NextResponse.json(
      { message: "Expected an array of { imageId, key }" },
      { status: 400 },
    );
  }

  await imageRepository.replaceAllB4ACarouselImages(body);
  return NextResponse.json({ success: true });
}
