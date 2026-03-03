import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameStatistics } from "@/shared/types";

interface GamesStatsCardsProps {
  stats: GameStatistics;
}

export default function GamesStatsCards({ stats }: GamesStatsCardsProps) {
  function displayWinRate() {
    return `${stats.overallResults.winPercentage.toFixed(2)}%`;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="text-center">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Games
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold">
              {stats.totalGames}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-600">
              Wins
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {stats.overallResults.wins}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-red-600">
              Losses
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold text-red-600">
              {stats.overallResults.losses}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center col-span-2 sm:col-span-1">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-yellow-600">
              Draws
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold text-yellow-600">
              {stats.overallResults.draws}
            </div>
          </CardContent>
        </Card>

        <Card className="text-center col-span-2 sm:col-span-3 lg:col-span-1">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold">
              {displayWinRate()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
