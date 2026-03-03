import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { gamesRepository } from "@/repos";
import { type GameInsert } from "@/schemas";
import { gamesServices } from "@/lib/backend/services/game.services";

type Params = { params: {} };

export async function PUT(req: Request, _ctx: Params) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();

  if (!Array.isArray(body)) {
    return NextResponse.json(
      { message: "Invalid games data - expected array" },
      { status: 400 },
    );
  }

  // body should already be validated on the client with Zod GAMES.gamesArrayValidationSchema
  const gamesToInsert = body as GameInsert[];

  const success = await gamesServices.replaceAllGames(gamesToInsert);

  if (!success) {
    return NextResponse.json(
      { message: "Failed to replace games" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: `Successfully replaced all games with ${gamesToInsert.length} new games`,
    },
    { status: 200 },
  );
}
