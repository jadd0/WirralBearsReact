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
		<Card className="hover:shadow-md transition-shadow w-full">
			<CardContent className="p-4 sm:p-6">
				{/* Mobile Layout */}
				<div className="block sm:hidden space-y-4">
					{/* Date and Result */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium text-sm">
								{format(new Date(game.date), 'MMM dd, yyyy')}
							</span>
						</div>
						<Badge
							variant="outline"
							className={`${getResultColor(result)} font-semibold uppercase`}
						>
							{result}
						</Badge>
					</div>

					{/* Gender, Age & Season */}
					<div className="flex items-center justify-between">
						<div className="flex gap-2">
							<Badge variant="secondary">{game.gender}</Badge>
							<Badge variant="secondary">U{game.ageGroup}</Badge>
						</div>
						<span className="text-sm text-muted-foreground">
							{getSeasonName(game.season)}
						</span>
					</div>

					{/* Score */}
					<div className="text-center">
						<div className="flex items-center justify-center gap-2">
							<span className="font-semibold text-sm">Wirral Bears</span>
							<span className="text-xl font-bold">{game.ourScore}</span>
							<span className="text-muted-foreground">-</span>
							<span className="text-xl font-bold">{game.otherScore}</span>
							<span className="font-semibold text-sm">
								{game.otherTeamName}
							</span>
						</div>
					</div>

					{/* Blog Link */}
					{blogTitle && (
						<div className="text-center">
							<Link to={`/blog/blog/${game.blog}`}>
								<Button variant="outline" size="sm" className="w-full">
									Read Blog:{' '}
									{blogTitle.length > 25
										? `${blogTitle.substring(0, 25)}...`
										: blogTitle}
								</Button>
							</Link>
						</div>
					)}
				</div>

				{/* Desktop Layout */}
				<div className="hidden sm:block">
					<div
						className={`grid ${
							compact ? 'grid-cols-6' : 'grid-cols-7'
						} gap-4 items-center`}
					>
						{/* Date */}
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium">
								{format(new Date(game.date), 'MMM dd, yyyy')}
							</span>
						</div>

						{/* Gender, Age Group & Season */}
						<div className="flex flex-col gap-1 items-center">
							<div className="flex gap-2">
								<Badge variant="secondary">{game.gender}</Badge>
								<Badge variant="secondary">U{game.ageGroup}</Badge>
							</div>
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
									<Button variant="link" className="p-0 h-auto text-left">
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
								<Link to={`/blog/blog/${game.blog}`}>
									<Button variant="outline" size="sm">
										Read Blog
									</Button>
								</Link>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
