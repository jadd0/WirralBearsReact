import { api } from '@/api/api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const games = createQueryKeys('games', {
	getAllGames: () => ({
		queryFn: async () => await api.games.getAllGames(),
		queryKey: ['games', 'getAll'],
	}),
	getGameById: (id: string) => ({
		queryFn: async () => await api.games.fetchGame(id),
		queryKey: ['games', 'getById', id],
	}),
	getGamesBySeason: (gender?: string) => ({
		queryFn: async () => await api.games.getGamesBySeason(gender),
		queryKey: ['games', 'getBySeason', gender || 'all'],
	}),
	getGamesBySeasonId: (seasonId: string) => ({
		queryFn: async () => await api.games.getGamesBySeasonId(seasonId),
		queryKey: ['games', 'getBySeasonId', seasonId],
	}),
	getGamesByGender: (gender: string) => ({
		queryFn: async () => await api.games.getGamesByGender(gender),
		queryKey: ['games', 'getByGender', gender],
	}),
	getGamesByDateRange: (startDate: Date, endDate: Date) => ({
		queryFn: async () =>
			await api.games.getGamesByDateRange(startDate, endDate),
		queryKey: [
			'games',
			'getByDateRange',
			startDate.toISOString(),
			endDate.toISOString(),
		],
	}),
	getRecentGames: (limit: number = 10) => ({
		queryFn: async () => await api.games.getRecentGames(limit),
		queryKey: ['games', 'getRecent', limit],
	}),
	getGameResults: (seasonId?: string, gender?: string) => ({
		queryFn: async () => await api.games.getGameResults(seasonId, gender),
		queryKey: ['games', 'getResults', seasonId || 'all', gender || 'all'],
	}),
	getGamesStatistics: () => ({
		queryFn: async () => await api.games.getGamesStatistics(),
		queryKey: ['games', 'getStatistics'],
	}),
});
