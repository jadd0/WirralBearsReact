import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Season } from '@wirralbears/backend-types';

interface GamesFiltersProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	selectedGender: string;
	setSelectedGender: (gender: string) => void;
	selectedSeason: string;
	setSelectedSeason: (season: string) => void;
	selectedResult: string;
	setSelectedResult: (result: string) => void;
	seasons: Season[];
	onClearFilters: () => void;
}

export default function GamesFilters({
	searchTerm,
	setSearchTerm,
	selectedGender,
	setSelectedGender,
	selectedSeason,
	setSelectedSeason,
	selectedResult,
	setSelectedResult,
	seasons,
	onClearFilters
}: GamesFiltersProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Filter className="h-5 w-5" />
					Filters
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search teams..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-9"
						/>
					</div>

					{/* Gender Filter - Fixed */}
					<Select value={selectedGender} onValueChange={setSelectedGender}>
						<SelectTrigger>
							<SelectValue placeholder="All Genders" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Genders</SelectItem>
							<SelectItem value="Male">Male</SelectItem>
							<SelectItem value="Female">Female</SelectItem>
							<SelectItem value="Mixed">Mixed</SelectItem>
						</SelectContent>
					</Select>

					{/* Season Filter - Fixed */}
					<Select value={selectedSeason} onValueChange={setSelectedSeason}>
						<SelectTrigger>
							<SelectValue placeholder="All Seasons" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Seasons</SelectItem>
							{seasons.map((season) => (
								<SelectItem key={season.id} value={season.id}>
									{season.season}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Result Filter - Fixed */}
					<Select value={selectedResult} onValueChange={setSelectedResult}>
						<SelectTrigger>
							<SelectValue placeholder="All Results" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Results</SelectItem>
							<SelectItem value="win">Wins</SelectItem>
							<SelectItem value="loss">Losses</SelectItem>
							<SelectItem value="draw">Draws</SelectItem>
						</SelectContent>
					</Select>

					{/* Clear Filters */}
					<Button variant="outline" onClick={onClearFilters}>
						Clear Filters
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
