import { useFetchOnMount } from "./useFetchOnMount";
import { useAsync } from "./useAsync";
import {
  getAllGames,
  replaceAllGames,
  // getGamesBySeason,
} from "@/api";
import type { Game, GameInsert } from "@/schemas";

export function useGames() {
  return useFetchOnMount<Game[]>(getAllGames);
}

export function useReplaceAllGames() {
  return useAsync((games: GameInsert[]) => replaceAllGames(games));
}
