import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { blogRepository } from "@/repos";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const blog = await blogRepository.getBlogById(params.id);
  if (!blog) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(blog);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  if (body.headings || body.paragraphs || body.imageReferences) {
    const updated = await blogRepository.updateBlogWithTransaction(
      params.id,
      body.title,
      body.headings ?? [],
      body.paragraphs ?? [],
      body.imageReferences ?? [],
    );
    return NextResponse.json(updated);
  }

  const updated = await blogRepository.updateBlog(params.id, body);
  if (!updated) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const ok = await blogRepository.deleteBlog(params.id);
  if (!ok) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(null, { status: 204 });
}
