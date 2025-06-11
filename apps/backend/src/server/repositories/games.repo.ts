import { eq, sql, and } from 'drizzle-orm';
import { db } from '@/db';
import {
	GamesBySeason,
	Game,
	GameInsert,
	games,
	seasons,
	Season,
} from '@/db/schemas/games.schema';

export const gamesRepository = {
	async updateAllGames(gamesToInsert: GameInsert[]): Promise<boolean> {
		return await db.transaction(async (tx) => {
			try {
				// First, delete all existing games
				await tx.delete(games);

				// Then insert all new games
				if (gamesToInsert.length > 0) {
					await tx.insert(games).values(gamesToInsert);
				}

				return true;
			} catch (error) {
				console.error('Transaction failed:', error);
				throw new Error(
					`Games update failed: ${
						error instanceof Error ? error.message : 'Unknown error'
					}`
				);
			}
		});
	},

	async getAllGames(): Promise<Game[]> {
		try {
			return await db.select().from(games).orderBy(games.date);
		} catch (error) {
			console.error('Failed to fetch all games:', error);
			throw new Error(
				`Failed to fetch games: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	async getGamesBySeason(gender?: string): Promise<GamesBySeason> {
		try {
			const query = db
				.select({
					game: games,
					seasonName: seasons.season,
				})
				.from(games)
				.innerJoin(seasons, eq(games.season, seasons.id))
				.orderBy(seasons.season, games.date);

			// Add gender filter if provided
			const result = gender
				? await query.where(eq(games.gender, gender))
				: await query;

			// Group games by season
			const groupedGames: Record<
				string,
				{
					seasonName: string;
					seasonId: string;
					games: Game[];
				}
			> = {};

			result.forEach(({ game, seasonName }) => {
				const seasonKey = game.season;

				if (!groupedGames[seasonKey]) {
					groupedGames[seasonKey] = {
						seasonName: seasonName || 'Unknown Season',
						seasonId: seasonKey,
						games: [],
					};
				}

				groupedGames[seasonKey].games.push(game);
			});

			// Convert to array format
			return Object.values(groupedGames).map(
				({ seasonName, seasonId, games }) => ({
					season: seasonName,
					seasonId,
					games,
				})
			);
		} catch (error) {
			console.error('Failed to fetch games by season:', error);
			throw new Error(
				`Failed to fetch games by season: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	async getGamesBySeasonId(seasonId: string): Promise<Game[]> {
		try {
			return await db
				.select()
				.from(games)
				.where(eq(games.season, seasonId))
				.orderBy(games.date);
		} catch (error) {
			console.error('Failed to fetch games by season ID:', error);
			throw new Error(
				`Failed to fetch games for season: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},

	async getAllSeasons(): Promise<Season[]> {
		try {
			return await db.select().from(seasons).orderBy(seasons.season);
		} catch (error) {
			console.error('Failed to fetch all seasons:', error);
			throw new Error(
				`Failed to fetch seasons: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	},
};
