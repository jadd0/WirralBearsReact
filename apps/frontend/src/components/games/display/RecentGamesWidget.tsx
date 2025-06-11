import { useGetRecentGames } from '@/hooks/games.hooks';
import { useGetAllSeasons } from '@/hooks/games.hooks';
import { useGetAllBlogPreviews } from '@/hooks/blog.hooks';
import GamesList from './GamesList';
import GamesLoading from '@/components/games/GamesLoading';

interface RecentGamesWidgetProps {
	limit?: number;
	compact?: boolean;
}

export default function RecentGamesWidget({ limit = 5, compact = true }: RecentGamesWidgetProps) {
	const { data: games = [], isLoading: gamesLoading } = useGetRecentGames(limit);
	const { data: seasons = [], isLoading: seasonsLoading } = useGetAllSeasons();
	const { data: blogs = [], isLoading: blogsLoading } = useGetAllBlogPreviews();

	if (gamesLoading || seasonsLoading || blogsLoading) {
		return <GamesLoading />;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Recent Games</h2>
			<GamesList 
				games={games}
				seasons={seasons}
				blogs={blogs}
				compact={compact}
			/>
		</div>
	);
}
