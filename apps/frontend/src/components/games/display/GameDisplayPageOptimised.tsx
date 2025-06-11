import { useState } from 'react';
import {
	useGetGamesBySeason,
	useGetGamesByGender,
	useGetAllSeasons,
	useGetGamesStatistics,
	useGetRecentGames,
} from '@/hooks/games.hooks';
import { useGetAllBlogPreviews } from '@/hooks/blog.hooks';
import GamesLoading from '@/components/games/GamesLoading';
import GamesDisplayHeader from './GamesDisplayHeader';
import GamesStatsCards from './GamesStatsCards';
import GamesFilters from './GamesFilters';
import GamesList from './GamesList';

interface GamesDisplayPageOptimizedProps {
	showFilters?: boolean;
	showStats?: boolean;
	compact?: boolean;
	recentOnly?: boolean;
	recentLimit?: number;
	preSelectedGender?: string;
	preSelectedSeason?: string;
}

export default function GamesDisplayPageOptimized({
	showFilters = true,
	showStats = true,
	compact = false,
	recentOnly = false,
	recentLimit = 10,
	preSelectedGender,
	preSelectedSeason,
}: GamesDisplayPageOptimizedProps) {
	const [selectedGender, setSelectedGender] = useState(
		preSelectedGender || 'all'
	);
	const [selectedSeason, setSelectedSeason] = useState(
		preSelectedSeason || 'all'
	);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedResult, setSelectedResult] = useState('all');

	// Use specific hooks based on filters
	const { data: recentGames, isLoading: recentLoading } =
		useGetRecentGames(recentLimit);
	const { data: gamesByGender, isLoading: genderLoading } = useGetGamesByGender(
		selectedGender === 'all' ? '' : selectedGender
	);
	const { data: gamesBySeason, isLoading: seasonLoading } = useGetGamesBySeason(
		selectedGender === 'all' ? undefined : selectedGender
	);
	const { data: seasons = [], isLoading: seasonsLoading } = useGetAllSeasons();
	const { data: blogs = [], isLoading: blogsLoading } = useGetAllBlogPreviews();
	const { data: statistics, isLoading: statsLoading } = useGetGamesStatistics();

	// Determine which games to display
	let displayGames = [];
	let isLoading = seasonsLoading || blogsLoading;

	if (recentOnly) {
		displayGames = recentGames || [];
		isLoading = isLoading || recentLoading;
	} else if (selectedGender !== 'all' && selectedSeason === 'all') {
		displayGames = gamesByGender || [];
		isLoading = isLoading || genderLoading;
	} else if (selectedGender !== 'all') {
		// Filter games by season from the gender-filtered results
		const seasonGames = gamesBySeason?.find(
			(season) => season.seasonId === selectedSeason
		);
		displayGames = seasonGames?.games || [];
		isLoading = isLoading || seasonLoading;
	} else {
		// Fallback to all games from gamesBySeason
		displayGames = gamesBySeason?.flatMap((season) => season.games) || [];
		isLoading = isLoading || seasonLoading;
	}

	// Apply client-side filtering for search and result filters
	const filteredGames = displayGames.filter((game) => {
		const matchesSearch =
			!searchTerm ||
			game.otherTeamName.toLowerCase().includes(searchTerm.toLowerCase());

		let matchesResult = true;
		if (selectedResult !== 'all') {
			if (selectedResult === 'win')
				matchesResult = game.ourScore > game.otherScore;
			else if (selectedResult === 'loss')
				matchesResult = game.ourScore < game.otherScore;
			else if (selectedResult === 'draw')
				matchesResult = game.ourScore === game.otherScore;
		}

		return matchesSearch && matchesResult;
	});

	const clearFilters = () => {
		setSearchTerm('');
		setSelectedGender('all');
		setSelectedSeason('all');
		setSelectedResult('all');
	};

	if (isLoading || (showStats && statsLoading)) {
		return <GamesLoading />;
	}

	return (
		<div className="p-6 space-y-6">
			<GamesDisplayHeader totalGames={filteredGames.length} />

			{showStats && statistics && <GamesStatsCards stats={statistics} />}

			{showFilters && (
				<GamesFilters
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					selectedGender={selectedGender}
					setSelectedGender={setSelectedGender}
					selectedSeason={selectedSeason}
					setSelectedSeason={setSelectedSeason}
					selectedResult={selectedResult}
					setSelectedResult={setSelectedResult}
					seasons={seasons}
					onClearFilters={clearFilters}
				/>
			)}

			<GamesList
				games={filteredGames}
				seasons={seasons}
				blogs={blogs}
				compact={compact}
			/>
		</div>
	);
}
