import { Game, GameInsert, GamesBySeason, Season } from "@/lib/db/schemas";
import { jsonFetch } from "./api";
import { GameStatistics } from "@/types";

export async function getAllGames() {
  return jsonFetch<Game[]>("/api/manual/games");
}

export async function replaceAllGames(games: GameInsert[]) {
  return jsonFetch<{ message: string }>("/api/manual/games/replace-all", {
    method: "PUT",
    body: JSON.stringify(games),
  });
}

export async function getAllSeasons() {
  return jsonFetch<Season[]>("/api/manual/games/seasons");
}

export async function getGamesStatistics() {
  return jsonFetch<GameStatistics>("/api/manual/games/statistics");
}

// TODO: implement
// export async function getGamesBySeason(gender?: string) {
//   const qs = gender ? `?gender=${encodeURIComponent(gender)}` : "";
//   return jsonFetch<GamesBySeason[]>(`/api/manual/games/by-season${qs}`);
// }
