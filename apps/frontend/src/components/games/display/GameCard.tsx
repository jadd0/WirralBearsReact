import { Game, Season } from '@wirralbears/backend-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GameCardProps {
	game: Game;
	seasons: Season[];
	blogs: Array<{ id: string; title: string }>;
	compact?: boolean;
}

export default function GameCard({
	game,
	seasons,
	blogs,
	compact = false,
}: GameCardProps) {
	const getGameResult = (game: Game) => {
		if (game.ourScore > game.otherScore) return 'win';
		if (game.ourScore < game.otherScore) return 'loss';
		return 'draw';
	};

	const getResultColor = (result: string) => {
		switch (result) {
			case 'win':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'loss':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'draw':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getSeasonName = (seasonId: string) => {
		const season = seasons.find((s) => s.id === seasonId);
		return season?.season || 'Unknown Season';
	};

	const getBlogTitle = (blogId: string | null) => {
		if (!blogId) return null;
		const blog = blogs.find((b) => b.id === blogId);
		return blog?.title || null;
	};

	const result = getGameResult(game);
	const blogTitle = getBlogTitle(game.blog);

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardContent className="p-6">
				<div
					className={`grid ${
						compact
							? 'grid-cols-1 md:grid-cols-6'
							: 'grid-cols-1 md:grid-cols-7'
					} gap-4 items-center`}
				>
					{/* Date */}
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<span className="font-medium">
							{format(new Date(game.date), 'MMM dd, yyyy')}
						</span>
					</div>

					{/* Gender & Season */}
					<div className="flex flex-col gap-1">
						<Badge variant="secondary" className="w-fit">
							{game.gender}
						</Badge>
						<span className="text-sm text-muted-foreground">
							{getSeasonName(game.season)}
						</span>
					</div>

					{/* Teams & Score */}
					<div className="flex items-center gap-2 col-span-2">
						<div className="flex items-center gap-2 flex-1">
							<span className="font-semibold">Wirral Bears</span>
							<span className="text-2xl font-bold">{game.ourScore}</span>
							<span className="text-muted-foreground">-</span>
							<span className="text-2xl font-bold">{game.otherScore}</span>
							<span className="font-semibold">{game.otherTeamName}</span>
						</div>
					</div>

					{/* Result */}
					<div className="flex justify-center">
						<Badge
							variant="outline"
							className={`${getResultColor(result)} font-semibold uppercase`}
						>
							{result}
						</Badge>
					</div>

					{/* Blog Link */}
					{!compact && (
						<div className="flex items-center">
							{blogTitle ? (
								<Button variant="link" className="p-0 h-auto">
									{blogTitle.length > 30
										? `${blogTitle.substring(0, 30)}...`
										: blogTitle}
								</Button>
							) : (
								<span className="text-muted-foreground text-sm">No blog</span>
							)}
						</div>
					)}

					{/* Actions */}
					<div className="flex justify-end">
						{blogTitle && (
							<Link
								to={`/blog/blog/${game.blog}`}
								className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
							>
								<Button variant="outline" size="sm" className='cursor-pointer'>
									Read Blog
								</Button>
							</Link>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
