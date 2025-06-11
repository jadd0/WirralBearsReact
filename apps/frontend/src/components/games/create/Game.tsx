import { useState } from 'react';
import { GameInsert, Season } from '@wirralbears/backend-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface GameComponentProps {
	game: GameInsert & { tempId?: string };
	seasons: Season[];
	blogs: Array<{ id: string; title: string }>;
	onUpdate: (
		gameId: string | undefined,
		updatedGame: GameInsert & { tempId?: string }
	) => void;
	onDelete: (gameId: string | undefined) => void;
}

export default function GameComponent({
	game,
	seasons,
	blogs,
	onUpdate,
	onDelete,
}: GameComponentProps) {
	const [date, setDate] = useState<Date | undefined>(
		game.date ? new Date(game.date) : undefined
	);

	const handleUpdate = (field: keyof GameInsert, value: any) => {
		const updatedGame = { ...game, [field]: value };
		onUpdate(game.id || game.tempId, updatedGame);
	};

	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		if (selectedDate) {
			handleUpdate('date', selectedDate);
		}
	};

	const handleGenderChange = (value: string) => {
		handleUpdate('gender', value);
		// Clear season when gender changes to ensure consistency
		if (game.season) {
			handleUpdate('season', '');
		}
	};

	const truncateTitle = (title: string, maxLength: number = 30) => {
		return title.length > maxLength
			? `${title.substring(0, maxLength)}...`
			: title;
	};

	// Filter seasons based on selected gender
	const filteredSeasons = seasons.filter(
		(season) => !game.gender || season.gender === game.gender
	);

	// Check if season dropdown should be disabled - should be disabled when NO gender is selected
	const isSeasonDisabled = () => !game.gender;

	console.log(blogs);

	return (
		<div className="flex flex-row items-center gap-4 p-4 border rounded-lg bg-card">
			{/* Gender Dropdown */}
			<div className="min-w-[120px]">
				<Select value={game.gender || ''} onValueChange={handleGenderChange}>
					<SelectTrigger>
						<SelectValue placeholder="Gender" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Male">Male</SelectItem>
						<SelectItem value="Female">Female</SelectItem>
						<SelectItem value="Mixed">Mixed</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Date Calendar */}
			<div className="min-w-[150px]">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								'w-full justify-start text-left font-normal',
								!date && 'text-muted-foreground'
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{date ? format(date, 'PPP') : <span>Pick a date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={date}
							onSelect={handleDateSelect}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>

			{/* Season Dropdown */}
			<div className="min-w-[150px]">
				<Select
					value={game.season || ''}
					onValueChange={(value) => handleUpdate('season', value)}
					disabled={isSeasonDisabled()}
				>
					<SelectTrigger
						className={cn(
							isSeasonDisabled() && 'opacity-50 cursor-not-allowed'
						)}
					>
						<SelectValue
							placeholder={
								isSeasonDisabled() ? 'Select Gender First' : 'Season'
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{filteredSeasons.map((season) => (
							<SelectItem key={season.id} value={season.id}>
								{season.season}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Our Score Input */}
			<div className="min-w-[100px]">
				<Input
					type="number"
					placeholder="Our Score"
					value={game.ourScore || ''}
					onChange={(e) => handleUpdate('ourScore', e.target.value)}
					min="0"
					step="1"
				/>
			</div>

			{/* Their Score Input */}
			<div className="min-w-[100px]">
				<Input
					type="number"
					placeholder="Their Score"
					value={game.otherScore || ''}
					onChange={(e) => handleUpdate('otherScore', e.target.value)}
					min="0"
					step="1"
				/>
			</div>

			{/* Other Team Name Input */}
			<div className="min-w-[100px]">
				<Input
					placeholder="Other Team Name"
					value={game.otherTeamName || ''}
					onChange={(e) => handleUpdate('otherTeamName', e.target.value)}
				/>
			</div>

			{/* Blog Dropdown (Optional) */}
			<div className="min-w-[200px]">
				<Select
					value={game.blog || ''}
					onValueChange={(value) =>
						handleUpdate('blog', value === 'null' ? null : value)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select Blog (Optional)">
							{game.blog && blogs.find((b) => b.id === game.blog)
								? truncateTitle(blogs.find((b) => b.id === game.blog)!.title)
								: 'No Blog Selected'}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="null">No Blog</SelectItem>
						{blogs.map((blog) => (
							<SelectItem key={blog.id} value={blog.id}>
								{blog.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Delete Button */}
			<Button
				variant="destructive"
				size="sm"
				onClick={() => onDelete(game.id || game.tempId)}
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);
}
