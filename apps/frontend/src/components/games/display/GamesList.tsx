import { Game, Season } from '@wirralbears/backend-types';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import GameCard from './GameCard';

interface GamesListProps {
	games: Game[];
	seasons: Season[];
	blogs: Array<{ id: string; title: string }>;
	compact?: boolean;
}

export default function GamesList({
	games,
	seasons,
	blogs,
	compact = false,
}: GamesListProps) {
	if (games.length === 0) {
		return (
			<div className="w-full">
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12 px-4">
						<Trophy className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2 text-center">
							No games found
						</h3>
						<p className="text-muted-foreground text-center max-w-md">
							Try adjusting your filters to see more games.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const sortedGames = games.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return (
		<div className="w-full space-y-4">
			{sortedGames.map((game) => (
				<GameCard
					key={game.id}
					game={game}
					seasons={seasons}
					blogs={blogs}
					compact={compact}
				/>
			))}
		</div>
	);
}
