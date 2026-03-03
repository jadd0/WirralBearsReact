import { Game, GameInsert, GamesBySeason } from "@/lib/db/schemas";
import { jsonFetch } from "./api";

export async function getAllGames() {
  return jsonFetch<Game[]>("/api/games");
}

export async function replaceAllGames(games: GameInsert[]) {
  return jsonFetch<{ message: string }>("/api/games/replace-all", {
    method: "PUT",
    body: JSON.stringify(games),
  });
}

// TODO: implement
// export async function getGamesBySeason(gender?: string) {
//   const qs = gender ? `?gender=${encodeURIComponent(gender)}` : "";
//   return jsonFetch<GamesBySeason[]>(`/api/games/by-season${qs}`);
// }
