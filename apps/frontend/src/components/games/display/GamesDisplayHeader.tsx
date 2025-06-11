interface GamesDisplayHeaderProps {
	totalGames: number;
}

export default function GamesDisplayHeader({
	totalGames,
}: GamesDisplayHeaderProps) {
	return (
		<div className="flex flex-col gap-2 justify-between items-center">
			<h1 className="text-3xl font-bold">Games</h1>
			<p className="text-muted-foreground">
				View all {totalGames} games with detailed results
			</p>
		</div>
	);
}
