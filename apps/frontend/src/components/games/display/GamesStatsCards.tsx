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

		if (totalGames === 0) {
			return '0.00%';
		}

		const winRate = ((wins + 0.5 * draws) / totalGames) * 100;
		return winRate.toFixed(2) + '%';
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
							{calculateWinRate()}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
