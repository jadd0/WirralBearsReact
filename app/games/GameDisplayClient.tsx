"use client";

import { Suspense, useMemo, useState, useCallback } from "react";
import { LogoBanner } from "@/components/layout/LogoBanner";
import { Footer } from "@/components/layout/Footer";
import GamesLoading from "@/components/games/GamesLoading";
import GamesDisplayHeader from "@/components/games/display/GamesDisplayHeader";
import GamesStatsCards from "@/components/games/display/GamesStatsCards";
import GamesFilters from "@/components/games/display/GamesFilters";
import GamesList from "@/components/games/display/GamesList";
import { useFetchOnMount } from "@/hooks";
import { useBlogPreviews } from "@/hooks";
import { Game, Season, GamesBySeason } from "@/lib/db/schemas";
import {
  getGamesByGenderAction,
  getGamesBySeasonAction,
  getAllSeasonsAction,
  getGamesStatisticsAction,
  getRecentGamesAction,
} from "@/actions";
import { GameStatistics } from "@/shared/types";

interface GamesDisplayPageProps {
  showFilters?: boolean;
  showStats?: boolean;
  compact?: boolean;
  recentOnly?: boolean;
  recentLimit?: number;
  preSelectedGender?: string;
  preSelectedSeason?: string;
  preSelectedAge?: string;
  initialGames: Game[];
  initialSeasons: Season[];
  initialStatistics?: GameStatistics;
}

export default function GamesDisplayPage({
  showFilters = true,
  showStats = true,
  compact = false,
  recentOnly = false,
  recentLimit = 10,
  preSelectedGender,
  preSelectedSeason,
  preSelectedAge,
  initialGames,
  initialSeasons,
  initialStatistics,
}: GamesDisplayPageProps) {
  // Filter state
  const [selectedGender, setSelectedGender] = useState(
    preSelectedGender || "all",
  );
  const [selectedAge, setSelectedAge] = useState(preSelectedAge || "all");
  const [selectedSeason, setSelectedSeason] = useState(
    preSelectedSeason || "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState("all");

  // Fetch blogs client-side (lightweight)
  const { data: blogs = [], loading: blogsLoading } = useBlogPreviews();
  const safeBlogs = blogs ?? [];

  // Filter games
  const filteredGames = useMemo(() => {
    return initialGames.filter((game) => {
      const matchesSearch =
        !searchTerm ||
        game.otherTeamName.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesResult = true;
      if (selectedResult !== "all") {
        if (selectedResult === "win")
          matchesResult = game.ourScore > game.otherScore;
        else if (selectedResult === "loss")
          matchesResult = game.ourScore < game.otherScore;
        else if (selectedResult === "draw")
          matchesResult = game.ourScore === game.otherScore;
      }

      const matchesAge = selectedAge === "all" || game.ageGroup === selectedAge;
      const matchesGender =
        selectedGender === "all" || game.gender === selectedGender;

      return matchesSearch && matchesResult && matchesAge && matchesGender;
    });
  }, [initialGames, searchTerm, selectedResult, selectedAge, selectedGender]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedGender("all");
    setSelectedAge("all");
    setSelectedSeason("all");
    setSelectedResult("all");
  }, []);

  const handleGenderChange = useCallback((gender: string) => {
    setSelectedGender(gender);
  }, []);

  const handleAgeChange = useCallback((age: string) => {
    setSelectedAge(age);
  }, []);

  // Show loading if blogs are still loading
  if (blogsLoading) {
    return <GamesLoading />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <LogoBanner />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <GamesDisplayHeader totalGames={filteredGames.length} />

          {showStats && initialStatistics && (
            <GamesStatsCards stats={initialStatistics} />
          )}

          {showFilters && (
            <GamesFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedGender={selectedGender}
              setSelectedGender={handleGenderChange}
              selectedAge={selectedAge}
              setSelectedAge={handleAgeChange}
              selectedSeason={selectedSeason}
              setSelectedSeason={setSelectedSeason}
              selectedResult={selectedResult}
              setSelectedResult={setSelectedResult}
              seasons={initialSeasons}
              onClearFilters={clearFilters}
            />
          )}

          <GamesList
            games={filteredGames}
            seasons={initialSeasons}
            blogs={safeBlogs}
            compact={compact}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
