import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { sessions } from "@/schemas";
import { eq } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(sessions);
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const session = await auth();
  
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return new NextResponse("Unauthoried", { status: 401 });
  }

  const body = await req.json();
  // TODO: validate with  Zod Sessions schema
  const [created] = await db
    .insert(sessions)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
