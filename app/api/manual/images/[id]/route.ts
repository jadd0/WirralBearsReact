import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { imageRepository } from "@/repos";

type Params = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    await imageRepository.deleteImage(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Failed to delete image",
      },
      { status: 500 },
    );
  }
}
