import { request } from '@/lib/network';
import { Game, GameInsert, GamesBySeason, Season } from '@wirralbears/backend-types';

/**
 * Fetches all games from the server
 * @returns Array of all games
 */
export async function getAllGames(): Promise<Game[]> {
	const { data } = await request({
		url: '/api/games/getAllGames',
		method: 'GET',
	});

	return data.games as Game[];
}

/**
 * Fetches a game by its ID
 * @param id - The ID of the game to fetch
 * @returns The game data
 */
export async function fetchGame(id: string): Promise<Game> {
	const { data } = await request({
		url: `/api/games/getGame/${id}`,
		method: 'GET',
	});

	return data.game as Game;
}

/**
 * Fetches games grouped by season with optional gender filter
 * @param gender - Optional gender filter
 * @returns Games grouped by season
 */
export async function getGamesBySeason(
	gender?: string
): Promise<GamesBySeason> {
	const url = gender
		? `/api/games/getGamesBySeason?gender=${encodeURIComponent(gender)}`
		: '/api/games/getGamesBySeason';

	const { data } = await request({
		url,
		method: 'GET',
	});

	return data.gamesBySeason as GamesBySeason;
}

/**
 * Fetches games for a specific season
 * @param seasonId - The ID of the season
 * @returns Array of games for the season
 */
export async function getGamesBySeasonId(seasonId: string): Promise<Game[]> {
	const { data } = await request({
		url: `/api/games/getGamesBySeason/${seasonId}`,
		method: 'GET',
	});

	return data.games as Game[];
}

/**
 * Fetches games filtered by gender
 * @param gender - The gender to filter by
 * @returns Array of games for the specified gender
 */
export async function getGamesByGender(gender: string): Promise<Game[]> {
	const { data } = await request({
		url: `/api/games/getGamesByGender/${gender}`,
		method: 'GET',
	});

	return data.games as Game[];
}

/**
 * Fetches games within a date range
 * @param startDate - Start date for the range
 * @param endDate - End date for the range
 * @returns Array of games within the date range
 */
export async function getGamesByDateRange(
	startDate: Date,
	endDate: Date
): Promise<Game[]> {
	const startDateStr = startDate;
	const endDateStr = endDate;

	const { data } = await request({
		url: `/api/games/getGamesByDateRange?startDate=${encodeURIComponent(
			startDateStr
		)}&endDate=${encodeURIComponent(endDateStr)}`,
		method: 'GET',
	});

	return data.games as Game[];
}

/**
 * Fetches recent games with optional limit
 * @param limit - Maximum number of games to return (default: 10)
 * @returns Array of recent games
 */
export async function getRecentGames(limit: number = 10): Promise<Game[]> {
	const { data } = await request({
		url: `/api/games/getRecentGames?limit=${limit}`,
		method: 'GET',
	});

	return data.games as Game[];
}

/**
 * Fetches game results and statistics
 * @param seasonId - Optional season ID filter
 * @param gender - Optional gender filter
 * @returns Game results with win/loss statistics
 */
export async function getGameResults(
	seasonId?: string,
	gender?: string
): Promise<{
	wins: number;
	losses: number;
	draws: number;
	totalGames: number;
	winPercentage: number;
	averageOurScore: number;
	averageOtherScore: number;
	scoreDifferential: number;
}> {
	let url = '/api/games/getGameResults';
	const params = new URLSearchParams();

	if (seasonId) params.append('seasonId', seasonId);
	if (gender) params.append('gender', gender);

	if (params.toString()) {
		url += `?${params.toString()}`;
	}

	const { data } = await request({
		url,
		method: 'GET',
	});

	return data.results;
}

/**
 * Fetches comprehensive games statistics
 * @returns Detailed statistics about all games
 */
export async function getGamesStatistics(): Promise<{
	totalGames: number;
	gamesByGender: Record<string, number>;
	gamesBySeason: Record<string, number>;
	recentGamesCount: number;
	overallResults: {
		wins: number;
		losses: number;
		draws: number;
		winPercentage: number;
	};
	scoreStatistics: {
		highestOurScore: number;
		lowestOurScore: number;
		averageOurScore: number;
		averageOtherScore: number;
	};
}> {
	const { data } = await request({
		url: '/api/games/getGamesStatistics',
		method: 'GET',
	});

	return data.statistics;
}

/**
 * Replaces all games with new data (bulk operation)
 * @param games - Array of game data to replace all existing games
 * @returns Success message
 */
export async function replaceAllGames(
	games: GameInsert[]
): Promise<{ message: string }> {
	const { data } = await request({
		url: '/api/games/replaceAllGames',
		method: 'PUT',
		data: { games },
	});

	return data;
}

/**
 * Fetches all seasons from the server
 * @returns Array of all seasons
 */
export async function getAllSeasons(): Promise<Season[]> {
	const { data } = await request({
		url: '/api/games/getAllSeasons',
		method: 'GET',
	});

	return data.seasons as Season[];
}