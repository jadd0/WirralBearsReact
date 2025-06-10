import { gamesServices } from '../services/games.services';
import { RequestHandler, Request, Response } from 'express';
import { GameInsert } from '@/db/schemas/games.schema';

export const getAllGames: RequestHandler = async (req, res) => {
	try {
		const games = await gamesServices.getAllGames();
		res.status(200).send({ games });
	} catch (error) {
		console.error('Error fetching games:', error);
		res.status(500).send({ message: 'Failed to fetch games' });
	}
};

export const getGameById: RequestHandler = async (req, res) => {
	const { id } = req.params;

	try {
		const game = await gamesServices.getGameById(id);

		if (game) res.status(200).send({ game });
		else res.status(404).send({ message: 'Game not found' });
	} catch (error) {
		console.error('Error fetching game:', error);
		res.status(500).send({ message: 'Failed to fetch game' });
	}
};

export const getGamesBySeason: RequestHandler = async (req, res) => {
	const { gender } = req.query;

	try {
		const gamesBySeason = await gamesServices.getGamesBySeason(
			gender as string
		);
		res.status(200).send({ gamesBySeason });
	} catch (error) {
		console.error('Error fetching games by season:', error);
		res.status(500).send({ message: 'Failed to fetch games by season' });
	}
};

export const getGamesBySeasonId: RequestHandler = async (req, res) => {
	const { seasonId } = req.params;

	try {
		const games = await gamesServices.getGamesBySeasonId(seasonId);
		res.status(200).send({ games });
	} catch (error) {
		console.error('Error fetching games for season:', error);
		res.status(500).send({ message: 'Failed to fetch games for season' });
	}
};

export const getGamesByGender: RequestHandler = async (req, res) => {
	const { gender } = req.params;

	try {
		const games = await gamesServices.getGamesByGender(gender);
		res.status(200).send({ games });
	} catch (error) {
		console.error(`Error fetching games for gender ${gender}:`, error);
		res.status(500).send({ message: 'Failed to fetch games by gender' });
	}
};

export const getGamesByDateRange: RequestHandler = async (req, res) => {
	const { startDate, endDate } = req.query;

	if (!startDate || !endDate) {
		res.status(400).send({ message: 'Start date and end date are required' });
		return;
	}

	try {
		const start = new Date(startDate as string);
		const end = new Date(endDate as string);

		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			res.status(400).send({ message: 'Invalid date format' });
			return;
		}

		const games = await gamesServices.getGamesByDateRange(start, end);
		res.status(200).send({ games });
	} catch (error) {
		console.error('Error fetching games by date range:', error);
		res.status(500).send({ message: 'Failed to fetch games by date range' });
	}
};

export const getRecentGames: RequestHandler = async (req, res) => {
	const { limit } = req.query;
	const gameLimit = limit ? parseInt(limit as string) : 10;

	if (isNaN(gameLimit) || gameLimit <= 0) {
		res.status(400).send({ message: 'Invalid limit parameter' });
		return;
	}

	try {
		const games = await gamesServices.getRecentGames(gameLimit);
		res.status(200).send({ games });
	} catch (error) {
		console.error('Error fetching recent games:', error);
		res.status(500).send({ message: 'Failed to fetch recent games' });
	}
};

export const getGameResults: RequestHandler = async (req, res) => {
	const { seasonId, gender } = req.query;

	try {
		const results = await gamesServices.getGameResults(
			seasonId as string,
			gender as string
		);
		res.status(200).send({ results });
	} catch (error) {
		console.error('Error calculating game results:', error);
		res.status(500).send({ message: 'Failed to calculate game results' });
	}
};

export const getGamesStatistics: RequestHandler = async (req, res) => {
	try {
		const statistics = await gamesServices.getGamesStatistics();
		res.status(200).send({ statistics });
	} catch (error) {
		console.error('Error fetching games statistics:', error);
		res.status(500).send({ message: 'Failed to fetch games statistics' });
	}
};

export const replaceAllGames: RequestHandler = async (req, res) => {
	const authorId = req.user?.id;

	if (!authorId) {
		res.status(401).send({ message: 'User not authenticated' });
		return;
	}

	const { games } = req.body;

	if (!games || !Array.isArray(games)) {
		res.status(400).send({ message: 'Invalid games data - expected array' });
		return;
	}

	try {
		const success = await gamesServices.replaceAllGames(games as GameInsert[]);

		if (success) {
			res.status(200).send({
				message: `Successfully replaced all games with ${games.length} new games`,
			});
		} else {
			res.status(500).send({ message: 'Failed to replace games' });
		}
	} catch (error) {
		console.error('Error replacing all games:', error);
		res.status(500).send({
			message: 'Failed to replace games',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export default {
	getAllGames,
	getGameById,
	getGamesBySeason,
	getGamesBySeasonId,
	getGamesByGender,
	getGamesByDateRange,
	getRecentGames,
	getGameResults,
	getGamesStatistics,
	replaceAllGames,
} as {};
