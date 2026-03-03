import { Suspense } from "react";
import GamesDisplayClient from "./GameDisplayClient";
import GamesLoading from "@/components/games/GamesLoading";
import {
  getGamesByGenderAction,
  getGamesBySeasonAction,
  getAllSeasonsAction,
  getGamesStatisticsAction,
  getRecentGamesAction,
} from "@/actions";
import { Game, Season } from "@/lib/db/schemas";

interface PageProps {
  searchParams: {
    gender?: string;
    season?: string;
    age?: string;
    recent?: string;
    limit?: string;
  };
}

export default async function GamesPage({ searchParams }: PageProps) {
  const { gender, season, age, recent, limit = "10" } = searchParams;

  // Parallel data fetching
  const [seasonsResult, statsResult, gamesResult] = await Promise.allSettled([
    getAllSeasonsAction(),
    getGamesStatisticsAction(),
    // Determine which games to fetch based on params
    recent
      ? getRecentGamesAction(parseInt(limit))
      : season
        ? getGamesBySeasonAction("")
        : gender
          ? getGamesByGenderAction(gender)
          : getGamesBySeasonAction(""),
  ]);

  let initialGames: Game[] = [];

  if (gamesResult.status === "fulfilled") {
    const value = gamesResult.value;

    const looksLikeGamesBySeason =
      Array.isArray(value) && value.length > 0 && "games" in value[0]; // narrow

    if (looksLikeGamesBySeason) {
      const groups = value as {
        season: string;
        seasonId: string;
        games: Game[];
      }[];

      if (season) {
        const seasonGroup = groups.find((g) => g.seasonId === season);
        initialGames = seasonGroup?.games ?? [];
      } else {
        initialGames = groups.flatMap((g) => g.games);
      }
    } else {
      // plain Game[]
      initialGames = value as Game[];
    }
  }

  const initialSeasons =
    seasonsResult.status === "fulfilled" ? seasonsResult.value : [];

  const initialStatistics =
    statsResult.status === "fulfilled" ? statsResult.value : undefined;

  return (
    <Suspense fallback={<GamesLoading />}>
      <GamesDisplayClient
        preSelectedGender={gender || undefined}
        preSelectedSeason={season || undefined}
        preSelectedAge={age || undefined}
        recentOnly={!!recent}
        recentLimit={parseInt(limit)}
        initialGames={initialGames}
        initialSeasons={initialSeasons}
        initialStatistics={initialStatistics}
      />
    </Suspense>
  );
}
