import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { blogRepository } from "@/repos";

export async function GET() {
  const blogs = await blogRepository.findAll();
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorised", { status: 401 });

  const body = await req.json(); // { title, headings, paragraphs, imageReferences }
  // TODO: zod
  const blog = await blogRepository.createBlogWithTransaction(
    body.title,
    userId,
    body.headings ?? [],
    body.paragraphs ?? [],
    body.imageReferences ?? [],
  );

  return NextResponse.json(blog, { status: 201 });
}
