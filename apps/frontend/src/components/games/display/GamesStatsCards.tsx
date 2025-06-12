import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameStats {
	wins: number;
	losses: number;
	draws: number;
	totalGames: number;
	winRate: string;
}

interface GamesStatsCardsProps {
	stats: GameStats;
}

export default function GamesStatsCards({ stats }: GamesStatsCardsProps) {
  function calculateWinRate() {
    const wins = stats.overallResults.wins;
    const losses = stats.overallResults.losses;
    const draws = stats.overallResults.draws;
    
    const totalGames = wins + losses + draws;
    
    // Handle edge case where no games have been played
    if (totalGames === 0) {
      return '0.00%';
    }
    
    const winRate = ((wins + 0.5 * draws) / totalGames) * 100;
    return winRate.toFixed(2) + '%';
  }

	return (
		<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5">
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Total Games</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalGames}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-green-600">
						Wins
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-600">{stats.overallResults.wins}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-red-600">
						Losses
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-red-600">{stats.overallResults.losses}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-yellow-600">
						Draws
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-yellow-600">
						{stats.overallResults.draws}
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Win Rate</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{calculateWinRate()}</div>
				</CardContent>
			</Card>
		</div>
	);
}
