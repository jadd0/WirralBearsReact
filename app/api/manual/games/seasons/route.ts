import { NextResponse } from "next/server";
import { gamesRepository } from "@/repos";

export async function GET() {
  const allGames = await gamesRepository.getAllSeasons();
  return NextResponse.json({ seasons: allGames });
}
