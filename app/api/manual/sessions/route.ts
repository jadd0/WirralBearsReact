import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sessionRepository } from "@/server/repositories/session.repo";

export async function GET() {
  const sessions = await sessionRepository.getAllSessions();
  return NextResponse.json(sessions);
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  // optionally validate with Zod
  const ok = await sessionRepository.createSession(body);
  if (!ok) return new NextResponse("Failed to create session", { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
