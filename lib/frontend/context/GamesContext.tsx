"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getAllGames, getAllSeasons, getGamesStatistics } from "@/api";
import { getAllBlogPreviews } from "@/api";
import { Game, Season } from "@/lib/db/schemas";
import { GameStatistics } from "@/shared/types";
import { BlogPreview } from "@/lib/db/repo";

type GamesContextValue = {
  games: Game[];
  seasons: Season[]; // full Season objects
  blogs: BlogPreview[];
  loading: boolean;
  error: Error | null;
  stats: GameStatistics | null;
};

const GamesContext = createContext<GamesContextValue | undefined>(undefined);

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [blogs, setBlogs] = useState<BlogPreview[]>([]);
  const [stats, setStats] = useState<GameStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [gamesRes, seasonsRes, blogsRes, statsRes] = await Promise.all([
          getAllGames(), // returns Game[]
          getAllSeasons(), // returns Season[]
          getAllBlogPreviews(), // returns BlogPreview[]
          getGamesStatistics(), // returns GamesStatistics
        ]);

        if (cancelled) return;

        setGames(gamesRes);
        setSeasons(seasonsRes);
        setBlogs(blogsRes);
        setStats(statsRes);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err : new Error("Failed to load games data"),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GamesContext.Provider
      value={{
        games,
        seasons,
        blogs,
        loading,
        error,
        stats,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
}

export function useGamesContext() {
  const ctx = useContext(GamesContext);
  if (!ctx) {
    throw new Error("useGamesContext must be used within a GamesProvider");
  }
  return ctx;
}
