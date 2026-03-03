import { NextResponse } from "next/server";
import { gamesServices } from "@/lib/backend/services/game.services";

export async function GET() {
  const allGames = await gamesServices.getGamesStatistics();
  return NextResponse.json({ games: allGames });
}
