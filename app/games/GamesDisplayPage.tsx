"use client";
import { useState, useMemo, useEffect } from "react";
import {
  getGamesBySeasonAction,
  getGamesByGenderAction,
  getAllSeasonsAction,
  getGamesStatisticsAction,
  getRecentGamesAction,
} from "@/actions";
import { useBlogPreviews } from "@/hooks";
import GamesLoading from "@/components/games/GamesLoading";
import GamesDisplayHeader from "@/components/games/display/GamesDisplayHeader";
import GamesStatsCards from "@/components/games/display/GamesStatsCards";
import GamesFilters from "@/components/games/display/GamesFilters";
import GamesList from "@/components/games/display/GamesList";
import { LogoBanner } from "@/components/layout/LogoBanner";
import { Footer } from "@/components/layout/Footer";

interface GamesDisplayPageProps {
  /**
   * Whether to show the filter bar (gender/age/season/search/result).
   */
  showFilters?: boolean;
  /**
   * Whether to show the statistics cards row.
   */
  showStats?: boolean;
  /**
   * Compact mode gets passed down into GamesList for a denser layout.
   */
  compact?: boolean;
  /**
   * If true, we show only recent games instead of all games, seasons, etc.
   */
  recentOnly?: boolean;
  /**
   * How many recent games to load when recentOnly = true.
   */
  recentLimit?: number;
  /**
   * Initial gender selection; defaults to 'all'.
   */
  preSelectedGender?: string;
  /**
   * Initial season selection; defaults to 'all'.
   */
  preSelectedSeason?: string;
  /**
   * Initial age group selection; defaults to 'all'.
   */
  preSelectedAge?: string;
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
}: GamesDisplayPageProps) {
  // -----------------------------
  // FILTER STATE (pure UI state)
  // -----------------------------

  const [selectedGender, setSelectedGender] = useState(
    preSelectedGender || "all",
  );
  const [selectedAge, setSelectedAge] = useState(preSelectedAge || "all");
  const [selectedSeason, setSelectedSeason] = useState(
    preSelectedSeason || "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState("all");

  // --------------------------------------------
  // DATA + LOADING STATE (replaces old hooks)
  // --------------------------------------------
  // Instead of custom hooks like useGetGamesBySeason, we keep the same separation
  // but store data in useState and fill it by calling your server actions.

  // Recent games for the "recentOnly" mode
  const [recentGames, setRecentGames] = useState<any[] | null>(null);
  const [recentLoading, setRecentLoading] = useState(false);

  // All games filtered by a particular gender (when a gender is selected)
  const [gamesByGender, setGamesByGender] = useState<any[] | null>(null);
  const [genderLoading, setGenderLoading] = useState(false);

  // All games grouped by season (array of { seasonId, games })
  const [gamesBySeason, setGamesBySeason] = useState<any[] | null>(null);
  const [seasonLoading, setSeasonLoading] = useState(false);

  // Season metadata list
  const [seasons, setSeasons] = useState<any[]>([]);
  const [seasonsLoading, setSeasonsLoading] = useState(false);

  // Aggregated statistics (for the stats cards)
  const [statistics, setStatistics] = useState<any | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Blogs still come from your existing hook; this is independent of the games actions
  const { data: blogs = [], loading: blogsLoading } = useBlogPreviews();

  // INITIAL LOAD (seasons, stats, all games by season)
  // This runs once on mount and pulls in "base" data that doesn't depend on filters

  useEffect(() => {
    let cancelled = false; // simple flag to avoid setting state on unmounted component

    async function loadInitial() {
      // Mark all initial pieces as loading
      setSeasonsLoading(true);
      setStatsLoading(true);
      setSeasonLoading(true);

      try {
        // Load seasons, statistics, and all games-by-season in parallel for speed
        const [seasonsRes, statsRes, gamesBySeasonRes] = await Promise.all([
          getAllSeasonsAction(),
          getGamesStatisticsAction(),
          // expects a specific gender parameter (e.g. 'all' vs empty string).
          getGamesBySeasonAction(""),
        ]);

        // If component unmounted while we were fetching, bail out
        if (cancelled) return;

        // Fallbacks so we never put undefined into state
        setSeasons(seasonsRes || []);
        setStatistics(statsRes || null);
        setGamesBySeason(gamesBySeasonRes || []);
      } finally {
        // Clear loading flags if still mounted
        if (!cancelled) {
          setSeasonsLoading(false);
          setStatsLoading(false);
          setSeasonLoading(false);
        }
      }
    }

    loadInitial();

    // Cleanup to prevent state updates after unmount
    return () => {
      cancelled = true;
    };
  }, []);

  // RELOAD GENDER-SPECIFIC GAMES WHEN GENDER CHANGES
  // This replaces useGetGamesByGender; whenever the selectedGender changes to something other than 'all', we fetch that gender's games from the server.

  useEffect(() => {
    // If "all" is selected, we don't need a gender-specific list
    if (selectedGender === "all") {
      setGamesByGender(null);
      return;
    }

    let cancelled = false;

    async function loadGender() {
      setGenderLoading(true);
      try {
        const data = await getGamesByGenderAction(selectedGender);
        if (!cancelled) {
          // Again, default to [] so downstream logic doesn't blow up on undefined
          setGamesByGender(data || []);
        }
      } finally {
        if (!cancelled) {
          setGenderLoading(false);
        }
      }
    }

    loadGender();

    // Cleanup to avoid state updates after unmount
    return () => {
      cancelled = true;
    };
  }, [selectedGender]);

  // RELOAD RECENT GAMES WHEN NEEDED
  useEffect(() => {
    if (!recentOnly) {
      // If not in "recent only" mode, ensure recentGames is cleared
      setRecentGames(null);
      return;
    }

    let cancelled = false;

    async function loadRecent() {
      setRecentLoading(true);
      try {
        const data = await getRecentGamesAction(recentLimit);
        if (!cancelled) {
          setRecentGames(data || []);
        }
      } finally {
        if (!cancelled) {
          setRecentLoading(false);
        }
      }
    }

    loadRecent();

    return () => {
      cancelled = true;
    };
  }, [recentOnly, recentLimit]);

  // -----------------------------
  // DERIVED VALUES / HELPERS
  // -----------------------------

  // Just a small memo to avoid recreating the seasons array on every render.
  // This is identical to what you had originally.
  const availableSeasons = useMemo(() => {
    return seasons;
  }, [seasons]);

  // Small wrappers so we can pass callbacks into child components
  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleAgeChange = (age: string) => {
    setSelectedAge(age);
  };

  // DECIDE WHICH GAMES ARRAY WE ARE SHOWING
  // - if recentOnly -> use recentGames
  // - else if a specific season is chosen -> use that season's games
  // - else if a specific gender is chosen -> use gender-based list
  // - else -> flatten all games across seasons

  let displayGames: any[] = [];
  // Base loading combines season + blogs; we'll OR more flags into it
  let isLoading = seasonsLoading || blogsLoading;

  if (recentOnly) {
    displayGames = recentGames || [];
    isLoading = isLoading || recentLoading;
  } else if (selectedSeason !== "all") {
    const seasonGames = gamesBySeason?.find(
      (seasonGroup) => seasonGroup.seasonId === selectedSeason,
    );
    displayGames = seasonGames?.games || [];
    isLoading = isLoading || seasonLoading;
  } else if (selectedGender !== "all") {
    displayGames = gamesByGender || [];
    isLoading = isLoading || genderLoading;
  } else {
    // Default: all games in all seasons, flattened into a single array
    displayGames =
      gamesBySeason?.flatMap((seasonGroup) => seasonGroup.games) || [];
    isLoading = isLoading || seasonLoading;
  }

  // APPLY CLIENT-SIDE FILTERS ON GAMES

  const filteredGames = displayGames.filter((game) => {
    // Text search on the other team name
    const matchesSearch =
      !searchTerm ||
      game.otherTeamName.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by result type: win / loss / draw / all
    let matchesResult = true;
    if (selectedResult !== "all") {
      if (selectedResult === "win")
        matchesResult = game.ourScore > game.otherScore;
      else if (selectedResult === "loss")
        matchesResult = game.ourScore < game.otherScore;
      else if (selectedResult === "draw")
        matchesResult = game.ourScore === game.otherScore;
    }

    // Filter by age group if a specific age group is selected
    let matchesAge = true;
    if (selectedAge !== "all") {
      matchesAge = game.ageGroup === selectedAge;
    }

    // Filter by gender if both gender and season are specified
    let matchesGender = true;
    if (selectedGender !== "all" && selectedSeason !== "all") {
      matchesGender = game.gender === selectedGender;
    }

    // Only keep games that satisfy all active filters
    return matchesSearch && matchesResult && matchesAge && matchesGender;
  });

  // ----------------
  // CLEAR ALL FILTERS
  // ----------------
  // Resets everything back to the default "show all" state.
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGender("all");
    setSelectedAge("all");
    setSelectedSeason("all");
    setSelectedResult("all");
  };

  // -------------------
  // LOADING STATE
  // -------------------
  if (isLoading || (showStats && statsLoading)) {
    return <GamesLoading />;
  }

  // ---------------
  // MAIN RENDER
  // ---------------

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Top banner / logo */}
      <LogoBanner />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with total number of games after all filters */}
          <GamesDisplayHeader totalGames={filteredGames.length} />

          {/* Statistics cards row; optional based on props and data */}
          {showStats && statistics && <GamesStatsCards stats={statistics} />}

          {/* Filter controls bar; optional based on props */}
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
              seasons={availableSeasons}
              onClearFilters={clearFilters}
            />
          )}

          {/* Main list of games, with blogs and seasons passed through */}
          <GamesList
            games={filteredGames}
            seasons={seasons}
            blogs={blogs ?? []}
            compact={compact}
          />
        </div>
      </div>

      {/* Page footer */}
      <Footer />
    </div>
  );
}
