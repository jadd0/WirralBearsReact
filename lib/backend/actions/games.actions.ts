"use server";

import { gamesServices } from "@/services";
import { Game, GameInsert, games, Season } from "@/schemas";

/** Wrapper for gamesServices.replaceAllGames */
export async function replaceAllGamesAction(
  newGames: GameInsert[],
): Promise<boolean> {
  return gamesServices.replaceAllGames(newGames);
}

/** Wrapper for gamesServices.getGamesByGender */
export async function getGamesByGenderAction(gender: string): Promise<Game[]> {
  return gamesServices.getGamesByGender(gender);
}

/** Wrapper for gamesServices.getGamesByDateRange */
export async function getGamesByDateRangeAction(
  startDate: Date,
  endDate: Date,
): Promise<Game[]> {
  return gamesServices.getGamesByDateRange(startDate, endDate);
}

/** Wrapper for gamesServices.getRecentGames */
export async function getRecentGamesAction(
  limit: number = 10,
): Promise<Game[]> {
  return gamesServices.getRecentGames(limit);
}

/** Wrapper for gamesServices.getAllSeasons */
export async function getAllSeasonsAction(): Promise<Season[]> {
  return gamesServices.getAllSeasons();
}

/** Wrapper for gamesServices.getGameResults */
export async function getGameResultsAction(params?: {
  seasonId?: string;
  gender?: string;
}) {
  return gamesServices.getGameResults(params?.seasonId, params?.gender);
}

/** Wrapper for gamesServices.getGamesStatistics */
export async function getGamesStatisticsAction() {
  return gamesServices.getGamesStatistics();
}

/** Wrapper for getting games by season */
export async function getGamesBySeasonAction(gender: string) {
  return gamesServices.getGamesBySeason(gender);
}
