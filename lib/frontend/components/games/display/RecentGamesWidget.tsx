"use client";

import { useMemo } from "react";
import { useGamesContext } from "@/context";
import GamesLoading from "@/components/games/GamesLoading";
import GamesList from "./GamesList";
import { Game } from "@/lib/db/schemas";

interface RecentGamesWidgetProps {
  limit?: number;
  compact?: boolean;
}

export default function RecentGamesWidget({
  limit = 5,
  compact = true,
}: RecentGamesWidgetProps) {
  const { games, seasons, blogs, loading, error } = useGamesContext();

  if (loading) return <GamesLoading />;
  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        Failed to load recent games.
      </div>
    );
  }

  const recentGames = useMemo(() => {
    const sorted: Game[] = [...games].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return sorted.slice(0, limit);
  }, [games, limit]);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Recent Games</h2>
      <GamesList
        games={recentGames}
        seasons={seasons}
        blogs={blogs}
        compact={compact}
      />
    </div>
  );
}
