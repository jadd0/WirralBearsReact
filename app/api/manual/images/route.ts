import { NextResponse } from "next/server";
import { imageRepository } from "@/repos";
import { IMAGE_LIMIT } from "@/shared/constants/images.constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursorParam = searchParams.get("cursor");
  const cursor = cursorParam ? Number(cursorParam) : 0;

  if (Number.isNaN(cursor) || cursor < 0) {
    return NextResponse.json({ message: "Invalid cursor" }, { status: 400 });
  }

  const items = await imageRepository.getAllImages(cursor);

  const hasMore = items.length > IMAGE_LIMIT;
  const data = hasMore ? items.slice(0, IMAGE_LIMIT) : items;
  const nextCursor = hasMore ? cursor + IMAGE_LIMIT : null;

  return NextResponse.json({
    images: data,
    nextCursor,
  });
}
