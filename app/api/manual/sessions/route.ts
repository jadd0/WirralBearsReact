import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { sessionRepository } from "@/repos";

export async function GET() {
  const sessions = await sessionRepository.getAllSessions();
  return NextResponse.json(sessions);
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) return new NextResponse("Unauthorised", { status: 401 });

  const body = await req.json();
  // TODO:  validate with Zod

  const result = await sessionRepository.createSession(body);
  if (!result)
    return new NextResponse("Failed to create session", { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
