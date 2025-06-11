import { api } from '@/api/api';
import { createConfigurableMutation } from '@/hooks/util/configurableMutation';
import { queries } from '@/queries';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	CreateMutationOptions,
	CreateMutationResult,
} from '@tanstack/react-query';
import { game, gameInsert, GamesBySeason } from '@/db/schemas/games.schema';

const staleTime = 1000 * 60 * 60; // 1 hour

/**
 * Replaces all games with new data (bulk operation)
 * @returns The result of the replace operation
 */
export const useReplaceAllGames = (): ((
	configuredOptions?: CreateMutationOptions<
		(games: gameInsert[]) => Promise<{ message: string }>,
		unknown
	>
) => CreateMutationResult<
	(games: gameInsert[]) => Promise<{ message: string }>,
	unknown
>) => {
	return createConfigurableMutation(
		api.games.replaceAllGames,
		['games', 'replaceAll'],
		{
			onSuccess: (data) => {
				toast.success('Games updated successfully', {
					description: data.message,
				});
			},
			onError: (error: Error) => {
				toast.error('Failed to update games', {
					description: error.message,
				});
			},
		}
	);
};

/**
 * Fetches all games
 * @returns All games from the server
 */
export const useGetAllGames = () =>
	useQuery({
		...queries.games.getAllGames(),
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load games', {
				description: error.message,
			});
		},
	});

/**
 * Fetches a game by its ID
 * @param id - The ID of the game to fetch
 * @returns The game with the given ID
 */
export const useGetGame = (id: string) =>
	useQuery({
		...queries.games.getGameById(id),
		enabled: !!id,
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load game', {
				description: error.message,
			});
		},
	});

/**
 * Fetches games grouped by season with optional gender filter
 * @param gender - Optional gender filter
 * @returns Games grouped by season
 */
export const useGetGamesBySeason = (gender?: string) =>
	useQuery({
		...queries.games.getGamesBySeason(gender),
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load games by season', {
				description: error.message,
			});
		},
	});

/**
 * Fetches games for a specific season
 * @param seasonId - The ID of the season
 * @returns Games for the specified season
 */
export const useGetGamesBySeasonId = (seasonId: string) =>
	useQuery({
		...queries.games.getGamesBySeasonId(seasonId),
		enabled: !!seasonId,
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load games for season', {
				description: error.message,
			});
		},
	});

/**
 * Fetches games filtered by gender
 * @param gender - The gender to filter by
 * @returns Games for the specified gender
 */
export const useGetGamesByGender = (gender: string) =>
	useQuery({
		...queries.games.getGamesByGender(gender),
		enabled: !!gender,
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load games by gender', {
				description: error.message,
			});
		},
	});

/**
 * Fetches games within a date range
 * @param startDate - Start date for the range
 * @param endDate - End date for the range
 * @returns Games within the specified date range
 */
export const useGetGamesByDateRange = (startDate: Date, endDate: Date) =>
	useQuery({
		...queries.games.getGamesByDateRange(startDate, endDate),
		enabled: !!startDate && !!endDate,
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load games by date range', {
				description: error.message,
			});
		},
	});

/**
 * Fetches recent games with optional limit
 * @param limit - Maximum number of games to return
 * @returns Recent games
 */
export const useGetRecentGames = (limit: number = 10) =>
	useQuery({
		...queries.games.getRecentGames(limit),
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load recent games', {
				description: error.message,
			});
		},
	});

/**
 * Fetches game results and statistics
 * @param seasonId - Optional season ID filter
 * @param gender - Optional gender filter
 * @returns Game results with win/loss statistics
 */
export const useGetGameResults = (seasonId?: string, gender?: string) =>
	useQuery({
		...queries.games.getGameResults(seasonId, gender),
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load game results', {
				description: error.message,
			});
		},
	});

/**
 * Fetches comprehensive games statistics
 * @returns Detailed statistics about all games
 */
export const useGetGamesStatistics = () =>
	useQuery({
		...queries.games.getGamesStatistics(),
		staleTime: staleTime,
		retry: 1,
		onError: (error: Error) => {
			toast.error('Failed to load games statistics', {
				description: error.message,
			});
		},
	});


