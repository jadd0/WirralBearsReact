import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { coachRepository } from "@/repos";

export async function GET() {
  const coaches = await coachRepository.findAll();
  return NextResponse.json(coaches);
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  // expect { title, headings, paragraphs, imageReferences }

  // TODO: zod

  const coach = await coachRepository.createCoachWithTransaction(
    body.title,
    userId,
    body.headings ?? [],
    body.paragraphs ?? [],
    body.imageReferences ?? [],
  );

  return NextResponse.json(coach, { status: 201 });
}
