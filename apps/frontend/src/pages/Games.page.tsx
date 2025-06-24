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
	const { data: recentGames, isLoading: recentLoading } =
		useGetRecentGames(recentLimit);

	const { data: gamesByGender, isLoading: genderLoading } = useGetGamesByGender(
		selectedGender === 'all' ? '' : selectedGender
	);

	const { data: gamesBySeason, isLoading: seasonLoading } =
		useGetGamesBySeason(undefined);

	const { data: seasons = [], isLoading: seasonsLoading } = useGetAllSeasons();

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

	let displayGames = [];
	let isLoading = seasonsLoading || blogsLoading;

	if (recentOnly) {
		displayGames = recentGames || [];
		isLoading = isLoading || recentLoading;
	} else if (selectedSeason !== 'all') {
		const seasonGames = gamesBySeason?.find(
			(seasonGroup) => seasonGroup.seasonId === selectedSeason
		);
		displayGames = seasonGames?.games || [];
		isLoading = isLoading || seasonLoading;
	} else if (selectedGender !== 'all') {
		displayGames = gamesByGender || [];
		isLoading = isLoading || genderLoading;
	} else {
		displayGames =
			gamesBySeason?.flatMap((seasonGroup) => seasonGroup.games) || [];
		isLoading = isLoading || seasonLoading;
	}

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

		let matchesAge = true;
		if (selectedAge !== 'all') {
			matchesAge = game.ageGroup === selectedAge;
		}

		let matchesGender = true;
		if (selectedGender !== 'all' && selectedSeason !== 'all') {
			matchesGender = game.gender === selectedGender;
		}

		return matchesSearch && matchesResult && matchesAge && matchesGender;
	});

	const clearFilters = () => {
		setSearchTerm('');
		setSelectedGender('all');
		setSelectedAge('all');
		setSelectedSeason('all');
		setSelectedResult('all');
	};

	if (isLoading || (showStats && statsLoading)) {
		return <GamesLoading />;
	}

	return (
		<div className="min-h-screen w-full flex flex-col">
			<LogoBanner />

			<div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
				<div className="max-w-7xl mx-auto space-y-6">
					{/* Header */}
					<GamesDisplayHeader totalGames={filteredGames.length} />

					{/* Statistics cards */}
					{showStats && statistics && <GamesStatsCards stats={statistics} />}

					{/* Filter controls */}
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

					{/* Main games list */}
					<GamesList
						games={filteredGames}
						seasons={seasons}
						blogs={blogs}
						compact={compact}
					/>
				</div>
			</div>

			<Footer />
		</div>
	);
}
