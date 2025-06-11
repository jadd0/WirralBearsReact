import { useGetGamesBySeason, useGetAllSeasons } from '@/hooks/games.hooks';
import { useGetAllBlogPreviews } from '@/hooks/blog.hooks';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GamesList from './GamesList';
import GamesLoading from '@/components/games/GamesLoading';

interface GamesBySeasonViewProps {
	preSelectedGender?: string;
}

export default function GamesBySeasonView({ preSelectedGender }: GamesBySeasonViewProps) {
	const [selectedGender, setSelectedGender] = useState(preSelectedGender || '');
	
	const { data: gamesBySeason = [], isLoading: gamesLoading } = useGetGamesBySeason(selectedGender);
	const { data: seasons = [], isLoading: seasonsLoading } = useGetAllSeasons();
	const { data: blogs = [], isLoading: blogsLoading } = useGetAllBlogPreviews();

	if (gamesLoading || seasonsLoading || blogsLoading) {
		return <GamesLoading />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h2 className="text-2xl font-bold">Games by Season</h2>
				<Select value={selectedGender} onValueChange={setSelectedGender}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="All Genders" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All Genders</SelectItem>
						<SelectItem value="Male">Male</SelectItem>
						<SelectItem value="Female">Female</SelectItem>
						<SelectItem value="Mixed">Mixed</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{gamesBySeason.map((seasonData) => {
				const season = seasons.find(s => s.id === seasonData.seasonId);
				return (
					<div key={seasonData.seasonId} className="space-y-4">
						<h3 className="text-xl font-semibold">
							{season?.season || 'Unknown Season'} ({seasonData.games.length} games)
						</h3>
						<GamesList 
							games={seasonData.games}
							seasons={seasons}
							blogs={blogs}
							compact={false}
						/>
					</div>
				);
			})}
		</div>
	);
}
