import { useState, useEffect } from 'react';
import { useGetAllGames, useReplaceAllGames } from '@/hooks/games.hooks';
import { useGetAllBlogPreviews } from '@/hooks/blog.hooks';
import { useGetAllSeasons } from '@/hooks/games.hooks';
import { GameInsert, Season } from '@wirralbears/backend-types';
import { toast } from 'sonner';
import { GAMES } from '@wirralbears/validation';
import GamesComponent from '@/components/games/create/Games';
import GamesPageHeader from '@/components/games/create/GameHeader';
import GamesEmptyState from '@/components/games/create/GamesEmpty';
import GamesLoading from '@/components/games/GamesLoading';

export default function GamesEditCreatePage() {
	const [games, setGames] = useState<(GameInsert & { tempId?: string })[]>([]);
	const [tempIdCounter, setTempIdCounter] = useState(0);

	// Hook calls
	const { data: existingGames, isLoading: gamesLoading } = useGetAllGames();
	const { data: seasons = [], isLoading: seasonsLoading } = useGetAllSeasons();
	const { data: blogs = [], isLoading: blogsLoading } = useGetAllBlogPreviews();
	const replaceAllGamesMutation = useReplaceAllGames();

	// Initialise games when data is loaded
	useEffect(() => {
		if (existingGames && existingGames.length > 0) {
			setGames(
				existingGames.map((game) => ({
					...game,
					date: game.date,
					ourScore: game.ourScore?.toString() || '',
					otherScore: game.otherScore?.toString() || '',
				}))
			);
		}
	}, [existingGames]);

	const handleUpdateGame = (
		gameId: string | undefined,
		updatedGame: GameInsert & { tempId?: string }
	) => {
		setGames((prevGames) =>
			prevGames.map((game) =>
				game.id === gameId || game.tempId === gameId ? updatedGame : game
			)
		);
	};

	const handleDeleteGame = (gameId: string | undefined) => {
		setGames((prevGames) =>
			prevGames.filter((game) => game.id !== gameId && game.tempId !== gameId)
		);
	};

	const handleAddGame = () => {
		const newTempId = `temp_${tempIdCounter}`;
		setTempIdCounter((prev) => prev + 1);

		const newGame: GameInsert & { tempId: string } = {
			tempId: newTempId,
			date: new Date(),
			gender: '',
			season: '',
			ageGroup: '',
			ourScore: '',
			otherScore: '',
			blog: null,
			otherTeamName: '',
		};

		setGames((prevGames) => [...prevGames, newGame]);
	};

	const handleSaveAllGames = async () => {
		console.log(games);
		try {
			// Prepare games for validation
			const gamesToValidate = games.map((game) => ({
				date: new Date(game.date),
				gender: game.gender,
				season: game.season,
				ageGroup: game.ageGroup,
				ourScore: game.ourScore,
				otherScore: game.otherScore,
				blog: game.blog || null,
				otherTeamName: game.otherTeamName || '', // Fixed property name
			}));

			console.log({gamesToValidate})

			// Validate using Zod schema
			const validatedGames =
				GAMES.gamesArrayValidationSchema.parse(gamesToValidate);

				console.log({validatedGames})

			// Convert to the format expected by the API
			const apiGames = validatedGames.map((game) => ({
				date: game.date,
				gender: game.gender,
				season: game.season,
				ageGroup: game.ageGroup,
				ourScore: parseInt(game.ourScore, 10), // Convert string to number
				otherScore: parseInt(game.otherScore, 10), // Convert string to number
				blog: game.blog,
				otherTeamName: game.otherTeamName,
			})) as GameInsert[];

			console.log({apiGames})

			await replaceAllGamesMutation.mutateAsync(apiGames);

			// Refresh the page data
			window.location.reload();
		} catch (error) {
			if (error instanceof Error) {
				toast.error('Validation failed', {
					description: error.message,
				});
			} else {
				toast.error('Failed to save games', {
					description: 'Unknown error occurred',
				});
			}
		}
	};

	if (gamesLoading || seasonsLoading || blogsLoading) {
		return <GamesLoading />;
	}

	return (
		<div className="p-6 space-y-6">
			<GamesPageHeader
				onAddGame={handleAddGame}
				onSaveAllGames={handleSaveAllGames}
				isSaving={replaceAllGamesMutation.isPending}
			/>

			{games.length === 0 ? (
				<GamesEmptyState onAddGame={handleAddGame} />
			) : (
				<GamesComponent
					games={games}
					seasons={seasons as Season[]}
					blogs={blogs}
					onUpdateGame={handleUpdateGame}
					onDeleteGame={handleDeleteGame}
				/>
			)}
		</div>
	);
}
