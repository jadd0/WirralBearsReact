import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { sessionRepository } from "@/repos";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const session = await sessionRepository.getSession(params.id);
  if (!session) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(session);
}

export async function PATCH(req: Request, { params }: Params) {
  const current = await auth();
  const userId = (current?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorised", { status: 401 });

  const updates = await req.json();
  const ok = await sessionRepository.updateSession(params.id, updates);
  if (!ok) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const current = await auth();
  const userId = (current?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorised", { status: 401 });

  const ok = await sessionRepository.deleteSession(params.id);
  if (!ok) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(null, { status: 204 });
}
