import { gamesRepository } from '../repositories/games.repo';
import {
	Game,
	GameInsert,
	GamesBySeason,
	Season,
} from '@/db/schemas/games.schema';

export const gamesServices = {
	/**
	 * Get all games ordered by date
	 */
	async getAllGames(): Promise<Game[]> {
		try {
			return await gamesRepository.getAllGames();
		} catch (error) {
			console.error('Failed to fetch all games:', error);
			throw new Error(
				`Failed to retrieve games: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Get games grouped by season with optional gender filter
	 */
	async getGamesBySeason(gender?: string): Promise<GamesBySeason> {
		try {
			return await gamesRepository.getGamesBySeason(gender);
		} catch (error) {
			console.error('Failed to fetch games by season:', error);
			throw new Error(
				`Failed to retrieve games by season: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Get games for a specific season
	 */
	async getGamesBySeasonId(seasonId: string): Promise<Game[]> {
		try {
			return await gamesRepository.getGamesBySeasonId(seasonId);
		} catch (error) {
			console.error(`Failed to fetch games for season ${seasonId}:`, error);
			throw new Error(
				`Failed to retrieve games for season: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Get a specific game by ID
	 */
	async getGameById(gameId: string): Promise<Game> {
		try {
			const allGames = await gamesRepository.getAllGames();
			const game = allGames.find((g) => g.id === gameId);

			if (!game) {
				throw new Error('Game not found');
			}

			return game;
		} catch (error) {
			console.error(`Failed to fetch game ${gameId}:`, error);
			throw new Error(
				`Failed to retrieve game: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Replace all games with new data
	 * This is useful for bulk updates from external sources
	 */
	async replaceAllGames(newGames: GameInsert[]): Promise<boolean> {
		try {
			// Transform the data before passing to repository
			const transformedGames = newGames.map((game) => ({
				...game,
				// Convert date strings to Date objects
				date: typeof game.date === 'string' ? new Date(game.date) : game.date,
				// Convert numeric scores from strings to numbers
				ourScore:
					typeof game.ourScore === 'string'
						? parseInt(game.ourScore)
						: game.ourScore,
				otherScore:
					typeof game.otherScore === 'string'
						? parseInt(game.otherScore)
						: game.otherScore,
				// Handle other timestamp fields if they exist
				...(game.createdAt &&
					typeof game.createdAt === 'string' && {
						createdAt: new Date(game.createdAt),
					}),
				...(game.updatedAt &&
					typeof game.updatedAt === 'string' && {
						updatedAt: new Date(game.updatedAt),
					}),
			}));

			const success = await gamesRepository.updateAllGames(transformedGames);

			if (!success) {
				throw new Error('Failed to replace games - transaction returned false');
			}

			console.log(
				`Successfully replaced all games with ${newGames.length} new games`
			);
			return true;
		} catch (error) {
			console.error('Failed to replace all games:', error);
			throw new Error(
				`Games replacement failed: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Get games filtered by gender
	 */
	async getGamesByGender(gender: string): Promise<Game[]> {
		try {
			const allGames = await gamesRepository.getAllGames();
			return allGames.filter((game) => game.gender === gender);
		} catch (error) {
			console.error(`Failed to fetch games for gender ${gender}:`, error);
			throw new Error(
				`Failed to retrieve games by gender: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Get games within a date range
	 */
	async getGamesByDateRange(startDate: Date, endDate: Date): Promise<Game[]> {
		try {
			const allGames = await gamesRepository.getAllGames();
			return allGames.filter((game) => {
				const gameDate = new Date(game.date);
				return gameDate >= startDate && gameDate <= endDate;
			});
		} catch (error) {
			console.error('Failed to fetch games by date range:', error);
			throw new Error(
				`Failed to retrieve games by date range: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Get recent games (last N games)
	 */
	async getRecentGames(limit: number = 10): Promise<Game[]> {
		try {
			const allGames = await gamesRepository.getAllGames();
			// Games are already ordered by date in the repository
			return allGames.slice(0, limit);
		} catch (error) {
			console.error('Failed to fetch recent games:', error);
			throw new Error(
				`Failed to retrieve recent games: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Get all seasons
	 */
	async getAllSeasons(): Promise<Season[]> {
		try {
			return await gamesRepository.getAllSeasons();
		} catch (error) {
			console.error('Failed to fetch all seasons:', error);
			throw new Error(
				`Failed to retrieve seasons: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Get game results (wins, losses, draws) with statistics
	 */
	async getGameResults(
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
		try {
			let games = [] as Game[];

			if (seasonId) {
				games = await gamesRepository.getGamesBySeasonId(seasonId);
			} else {
				games = await gamesRepository.getAllGames();
			}

			// Apply gender filter if specified
			if (gender) {
				games = games.filter((game) => game.gender === gender);
			}

			let wins = 0;
			let losses = 0;
			let draws = 0;
			let totalOurScore = 0;
			let totalOtherScore = 0;

			games.forEach((game) => {
				totalOurScore += game.ourScore;
				totalOtherScore += game.otherScore;

				if (game.ourScore > game.otherScore) {
					wins++;
				} else if (game.ourScore < game.otherScore) {
					losses++;
				} else {
					draws++;
				}
			});

			const totalGames = games.length;
			const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;
			const averageOurScore = totalGames > 0 ? totalOurScore / totalGames : 0;
			const averageOtherScore =
				totalGames > 0 ? totalOtherScore / totalGames : 0;
			const scoreDifferential = averageOurScore - averageOtherScore;

			return {
				wins,
				losses,
				draws,
				totalGames,
				winPercentage,
				averageOurScore,
				averageOtherScore,
				scoreDifferential,
			};
		} catch (error) {
			console.error('Failed to calculate game results:', error);
			throw new Error(
				`Failed to calculate game results: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	/**
	 * Get games statistics with comprehensive data
	 */
	async getGamesStatistics(): Promise<{
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
		try {
			const allGames = await gamesRepository.getAllGames();
			const gamesBySeason = await gamesRepository.getGamesBySeason();

			// Count games by gender
			const gamesByGender: Record<string, number> = {};
			allGames.forEach((game) => {
				gamesByGender[game.gender] = (gamesByGender[game.gender] || 0) + 1;
			});

			// Count games by season
			const gamesCountBySeason: Record<string, number> = {};
			gamesBySeason.forEach((seasonData) => {
				gamesCountBySeason[seasonData.season] = seasonData.games.length;
			});

			// Count recent games (last 30 days)
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
			const recentGamesCount = allGames.filter(
				(game) => new Date(game.date) >= thirtyDaysAgo
			).length;

			// Calculate overall results
			let wins = 0;
			let losses = 0;
			let draws = 0;
			let ourScores: number[] = [];
			let otherScores: number[] = [];

			allGames.forEach((game) => {
				ourScores.push(game.ourScore);
				otherScores.push(game.otherScore);

				if (game.ourScore > game.otherScore) {
					wins++;
				} else if (game.ourScore < game.otherScore) {
					losses++;
				} else {
					draws++;
				}
			});

			const totalGames = allGames.length;
			const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;

			// Score statistics
			const scoreStatistics = {
				highestOurScore: ourScores.length > 0 ? Math.max(...ourScores) : 0,
				lowestOurScore: ourScores.length > 0 ? Math.min(...ourScores) : 0,
				averageOurScore:
					ourScores.length > 0
						? ourScores.reduce((a, b) => a + b, 0) / ourScores.length
						: 0,
				averageOtherScore:
					otherScores.length > 0
						? otherScores.reduce((a, b) => a + b, 0) / otherScores.length
						: 0,
			};

			return {
				totalGames,
				gamesByGender,
				gamesBySeason: gamesCountBySeason,
				recentGamesCount,
				overallResults: {
					wins,
					losses,
					draws,
					winPercentage,
				},
				scoreStatistics,
			};
		} catch (error) {
			console.error('Failed to fetch games statistics:', error);
			throw new Error(
				`Failed to retrieve games statistics: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},
};

export default gamesServices;
