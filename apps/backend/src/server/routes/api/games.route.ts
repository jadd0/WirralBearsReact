import { Router } from 'express';
import * as gamesControllers from '../../controllers/games.controllers';
import { ensureAuthenticated } from '@/server/middleware/auth.middleware';

const router: Router = Router();

// GET all games
router.get('/getAllGames', gamesControllers.getAllGames);

// GET a single game by ID
router.get('/getGame/:id', gamesControllers.getGameById);

// GET games grouped by season (with optional gender filter via query)
router.get('/getGamesBySeason', gamesControllers.getGamesBySeason);

// GET games for a specific season
router.get('/getGamesBySeason/:seasonId', gamesControllers.getGamesBySeasonId);

// GET games filtered by gender
router.get('/getGamesByGender/:gender', gamesControllers.getGamesByGender);

// GET games within a date range (requires startDate and endDate query params)
router.get('/getGamesByDateRange', gamesControllers.getGamesByDateRange);

// GET recent games (with optional limit query param)
router.get('/getRecentGames', gamesControllers.getRecentGames);

// GET game results/statistics (with optional seasonId and gender query params)
router.get('/getGameResults', gamesControllers.getGameResults);

// GET comprehensive games statistics
router.get('/getGamesStatistics', gamesControllers.getGamesStatistics);

// PUT (replace) all games 
router.put(
	'/replaceAllGames',
	ensureAuthenticated,
	gamesControllers.replaceAllGames
);

export default router;
