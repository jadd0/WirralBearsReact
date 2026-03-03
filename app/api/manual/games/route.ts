import { NextResponse } from "next/server";
import { gamesRepository } from "@/repos";

export async function GET() {
  const allGames = await gamesRepository.getAllGames();
  return NextResponse.json({ games: allGames });
}
