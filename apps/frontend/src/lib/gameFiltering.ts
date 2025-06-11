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

	return {
		filteredGames,
		localStats,
		searchTerm,
		setSearchTerm,
		selectedGender,
		setSelectedGender,
		selectedSeason,
		setSelectedSeason,
		selectedResult,
		setSelectedResult,
		clearFilters
	};
}
