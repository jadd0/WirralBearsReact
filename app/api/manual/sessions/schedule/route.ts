import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { sessionRepository } from "@/repos";

export async function GET() {
  const schedule = await sessionRepository.getFullSchedule();
  return NextResponse.json(schedule);
}

export async function PUT(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json(); // FullSessionSchedule
  const ok = await sessionRepository.replaceAllSessions(body);
  if (!ok)
    return new NextResponse("Failed to update schedule", { status: 500 });
  return NextResponse.json({ success: true });
}
