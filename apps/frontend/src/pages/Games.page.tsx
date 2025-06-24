import { useState, useMemo } from 'react';
import {
	useGetGamesBySeason,
	useGetGamesByGender,
	useGetAllSeasons,
	useGetGamesStatistics,
	useGetRecentGames,
} from '@/hooks/games.hooks';
import { useGetAllBlogPreviews } from '@/hooks/blog.hooks';
import GamesLoading from '@/components/games/GamesLoading';
import GamesDisplayHeader from '@/components/games/display/GamesDisplayHeader';
import GamesStatsCards from '@/components/games/display/GamesStatsCards';
import GamesFilters from '@/components/games/display/GamesFilters';
import GamesList from '@/components/games/display/GamesList';
import { LogoBanner } from '@/components/layout/LogoBanner';
import { Footer } from '@/components/layout/Footer';

interface GamesDisplayPageProps {
	showFilters?: boolean;
	showStats?: boolean;
	compact?: boolean;
	recentOnly?: boolean;
	recentLimit?: number;
	preSelectedGender?: string;
	preSelectedSeason?: string;
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
	// State management for all filter options
	const [selectedGender, setSelectedGender] = useState(
		preSelectedGender || 'all'
	);
	const [selectedAge, setSelectedAge] = useState(preSelectedAge || 'all');
	const [selectedSeason, setSelectedSeason] = useState(
		preSelectedSeason || 'all'
	);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedResult, setSelectedResult] = useState('all');

	// Data fetching hooks
	// Recent games for when recentOnly is true
	const { data: recentGames, isLoading: recentLoading } =
		useGetRecentGames(recentLimit);

	// Games filtered by gender (when gender is selected)
	const { data: gamesByGender, isLoading: genderLoading } = useGetGamesByGender(
		selectedGender === 'all' ? '' : selectedGender
	);

	// Games grouped by season - fetch all seasons
	const { data: gamesBySeason, isLoading: seasonLoading } =
		useGetGamesBySeason(undefined);

	// All available seasons from the database
	const { data: seasons = [], isLoading: seasonsLoading } = useGetAllSeasons();

	// Blog data and statistics
	const { data: blogs = [], isLoading: blogsLoading } = useGetAllBlogPreviews();
	const { data: statistics, isLoading: statsLoading } = useGetGamesStatistics();

	const availableSeasons = useMemo(() => {
		return seasons;
	}, [seasons]);

	const handleGenderChange = (gender: string) => {
		setSelectedGender(gender);
	};

	const handleAgeChange = (age: string) => {
		setSelectedAge(age);
	};

	/**
	 * Determine which games to display based on current filter selections
	 * Priority order:
	 * 1. Recent games (if recentOnly is true)
	 * 2. Season selected (with optional gender filtering)
	 * 3. Gender only
	 * 4. All games
	 */
	let displayGames = [];
	let isLoading = seasonsLoading || blogsLoading;

	if (recentOnly) {
		// Show only recent games regardless of other filters
		displayGames = recentGames || [];
		isLoading = isLoading || recentLoading;
	} else if (selectedSeason !== 'all') {
		// Season is selected - show games from that season
		const seasonGames = gamesBySeason?.find(
			(seasonGroup) => seasonGroup.seasonId === selectedSeason
		);
		displayGames = seasonGames?.games || [];
		isLoading = isLoading || seasonLoading;
	} else if (selectedGender !== 'all') {
		// Only gender is selected - show all games for that gender
		displayGames = gamesByGender || [];
		isLoading = isLoading || genderLoading;
	} else {
		// No specific filters - show all games
		displayGames =
			gamesBySeason?.flatMap((seasonGroup) => seasonGroup.games) || [];
		isLoading = isLoading || seasonLoading;
	}

	/**
	 * Apply client-side filtering for search term, result type, age, and gender
	 * These filters are applied after the main data selection logic above
	 * Note: Gender filtering is applied here when a season is selected
	 */
	const filteredGames = displayGames.filter((game) => {
		// Search term filtering (case-insensitive team name search)
		const matchesSearch =
			!searchTerm ||
			game.otherTeamName.toLowerCase().includes(searchTerm.toLowerCase());

		// Result type filtering (win/loss/draw)
		let matchesResult = true;
		if (selectedResult !== 'all') {
			if (selectedResult === 'win')
				matchesResult = game.ourScore > game.otherScore;
			else if (selectedResult === 'loss')
				matchesResult = game.ourScore < game.otherScore;
			else if (selectedResult === 'draw')
				matchesResult = game.ourScore === game.otherScore;
		}

		// Age group filtering (applied to games)
		let matchesAge = true;
		if (selectedAge !== 'all') {
			matchesAge = game.ageGroup === selectedAge;
		}

		// Gender filtering (applied when season is selected, since season data includes all genders)
		let matchesGender = true;
		if (selectedGender !== 'all' && selectedSeason !== 'all') {
			matchesGender = game.gender === selectedGender;
		}

		return matchesSearch && matchesResult && matchesAge && matchesGender;
	});

	/**
	 * Reset all filters to their default state
	 */
	const clearFilters = () => {
		setSearchTerm('');
		setSelectedGender('all');
		setSelectedAge('all');
		setSelectedSeason('all');
		setSelectedResult('all');
	};

	// Show loading state while any required data is being fetched
	if (isLoading || (showStats && statsLoading)) {
		return <GamesLoading />;
	}

	return (
		<div className="space-y-6 min-w-full">
			<LogoBanner />

			<div className="p-6 pt-0 flex flex-col items-center">
				{/* Header showing total number of filtered games */}
				<GamesDisplayHeader totalGames={filteredGames.length} />

				{/* Statistics cards (optional) */}
				{showStats && statistics && <GamesStatsCards stats={statistics} />}

				{/* Filter controls (optional) */}
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

				{/* Main games list display */}
				<GamesList
					games={filteredGames}
					seasons={seasons}
					blogs={blogs}
					compact={compact}
				/>
			</div>
			<Footer />
		</div>
	);
}
