import { gamesServices } from "@/lib/backend/services/game.services";

export type GameStatistics = Awaited<
  ReturnType<typeof gamesServices.getGamesStatistics>
>;
