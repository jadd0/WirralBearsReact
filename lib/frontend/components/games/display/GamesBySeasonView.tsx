"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GamesList from "./GamesList";
import GamesLoading from "@/components/games/GamesLoading";
import { useGamesContext } from "@/context";
import { Game } from "@/lib/db/schemas";

interface GamesBySeasonViewProps {
  preSelectedGender?: string;
}

export default function GamesBySeasonView({
  preSelectedGender,
}: GamesBySeasonViewProps) {
  const [selectedGender, setSelectedGender] = useState(preSelectedGender || "");
  const { games, seasons, blogs, loading, error } = useGamesContext();

  if (loading) return <GamesLoading />;
  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        Failed to load games. {error.message}
      </div>
    );
  }

  // Filter by gender (if any), then group by seasonId
  const gamesBySeason = useMemo(() => {
    const filtered: Game[] =
      selectedGender === ""
        ? games
        : games.filter((g) => g.gender === selectedGender);

    const map: Record<
      string,
      {
        seasonId: string;
        games: Game[];
      }
    > = {};

    for (const game of filtered) {
      const seasonId = game.season; // matches seasons[i].id
      if (!map[seasonId]) {
        map[seasonId] = { seasonId, games: [] };
      }
      map[seasonId].games.push(game);
    }

    // Preserve season order from seasons array
    return seasons
      .map((s) => map[s.id])
      .filter((v): v is { seasonId: string; games: Game[] } => !!v);
  }, [games, seasons, selectedGender]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Games by Season</h2>
        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Genders</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {gamesBySeason.map((seasonData) => {
        const season = seasons.find((s) => s.id === seasonData.seasonId);
        return (
          <div key={seasonData.seasonId} className="space-y-4">
            <h3 className="text-xl font-semibold">
              {season?.season || "Unknown Season"} ({seasonData.games.length}{" "}
              games)
            </h3>
            <GamesList
              games={seasonData.games}
              seasons={seasons}
              blogs={blogs}
              compact={false}
            />
          </div>
        );
      })}
    </div>
  );
}
