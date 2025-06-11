import { useState, useMemo } from 'react';
import { Game } from '@wirralbears/backend-types';

export function useGamesFiltering(games: Game[]) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedGender, setSelectedGender] = useState<string>('all');
	const [selectedSeason, setSelectedSeason] = useState<string>('all');
	const [selectedResult, setSelectedResult] = useState<string>('all');

	const filteredGames = useMemo(() => {
		return games.filter((game) => {
			const matchesSearch = !searchTerm || 
				game.otherTeamName.toLowerCase().includes(searchTerm.toLowerCase());
			
			const matchesGender = selectedGender === 'all' || game.gender === selectedGender;
			const matchesSeason = selectedSeason === 'all' || game.season === selectedSeason;
			
			let matchesResult = true;
			if (selectedResult !== 'all') {
				if (selectedResult === 'win') matchesResult = game.ourScore > game.otherScore;
				else if (selectedResult === 'loss') matchesResult = game.ourScore < game.otherScore;
				else if (selectedResult === 'draw') matchesResult = game.ourScore === game.otherScore;
			}

			return matchesSearch && matchesGender && matchesSeason && matchesResult;
		});
	}, [games, searchTerm, selectedGender, selectedSeason, selectedResult]);

	// Available seasons based on selected gender
	const availableSeasons = useMemo(() => {
		let seasonsToShow = games;
		
		// If a gender is selected, only show seasons for that gender
		if (selectedGender !== 'all') {
			seasonsToShow = games.filter(game => game.gender === selectedGender);
		}
		
		// Get unique seasons
		const uniqueSeasons = [...new Set(seasonsToShow.map(game => game.season))];
		return uniqueSeasons.sort();
	}, [games, selectedGender]);

	// Local stats calculation
	const localStats = useMemo(() => {
		const wins = filteredGames.filter(game => game.ourScore > game.otherScore).length;
		const losses = filteredGames.filter(game => game.ourScore < game.otherScore).length;
		const draws = filteredGames.filter(game => game.ourScore === game.otherScore).length;
		const totalGames = filteredGames.length;
		const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : '0';

		return { wins, losses, draws, totalGames, winRate };
	}, [filteredGames]);

	const clearFilters = () => {
		setSearchTerm('');
		setSelectedGender('all');
		setSelectedSeason('all');
		setSelectedResult('all');
	};

	// Reset season when gender changes (optional but recommended UX)
	const setSelectedGenderWithSeasonReset = (gender: string) => {
		setSelectedGender(gender);
		// Reset season when gender changes to avoid invalid combinations
		setSelectedSeason('all');
	};

	return {
		filteredGames,
		localStats,
		availableSeasons, 
		searchTerm,
		setSearchTerm,
		selectedGender,
		setSelectedGender: setSelectedGenderWithSeasonReset, 
		selectedSeason,
		setSelectedSeason,
		selectedResult,
		setSelectedResult,
		clearFilters
	};
}
