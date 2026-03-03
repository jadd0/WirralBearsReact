import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { coachRepository } from "@/repos";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const coach = await coachRepository.getCoachById(params.id);
  if (!coach) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(coach);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();

  if (body.headings || body.paragraphs || body.imageReferences) {
    const updated = await coachRepository.updateCoachWithTransaction(
      params.id,
      body.title,
      body.headings ?? [],
      body.paragraphs ?? [],
      body.imageReferences ?? [],
    );
    return NextResponse.json(updated);
  }

  const updated = await coachRepository.updateCoach(params.id, body);
  if (!updated) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const result = await coachRepository.deleteCoach(params.id);
  if (!result) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(null, { status: 204 });
}
