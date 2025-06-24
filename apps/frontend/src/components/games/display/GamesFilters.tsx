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
	// Search functionality
	searchTerm: string;
	setSearchTerm: (term: string) => void;

	// Gender filtering
	selectedGender: string;
	setSelectedGender: (gender: string) => void;

	// Age filtering (applied to games only)
	selectedAge: string;
	setSelectedAge: (age: string) => void;

	// Season filtering (now gender-independent)
	selectedSeason: string;
	setSelectedSeason: (season: string) => void;

	// Result filtering
	selectedResult: string;
	setSelectedResult: (result: string) => void;

	// Available seasons (no longer filtered by gender)
	seasons: Season[];

	// Clear all filters function
	onClearFilters: () => void;
}

/**
 * GamesFilters Component
 *
 * Provides a comprehensive filtering interface for games data including:
 * - Text search by team name
 * - Gender filtering (Male/Female/Mixed) - affects games only
 * - Age group filtering (11-18) - affects games only
 * - Season filtering (gender-independent) - shows all available seasons
 * - Result filtering (Win/Loss/Draw)
 * - Clear all filters functionality
 */
export default function GamesFilters({
	searchTerm,
	setSearchTerm,
	selectedGender,
	setSelectedGender,
	selectedAge,
	setSelectedAge,
	selectedSeason,
	setSelectedSeason,
	selectedResult,
	setSelectedResult,
	seasons,
	onClearFilters,
}: GamesFiltersProps) {
	return (
		<div className="mt-3 mb-8 md:w-2/3">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Filters
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* Responsive grid layout for filter controls */}
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{/* Search Input - Filter by team name */}
						<div className="relative">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search teams..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-9"
							/>
						</div>

						{/* Gender Filter - Male/Female/Mixed/All */}
						{/* This affects game filtering only (not season availability) */}
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

						{/* Age Filter - Age groups 11-18 */}
						{/* This affects game filtering only */}
						<Select value={selectedAge} onValueChange={setSelectedAge}>
							<SelectTrigger>
								<SelectValue placeholder="All Ages" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Ages</SelectItem>
								{/* Generate age options from 11 to 18 */}
								{Array.from({ length: 8 }, (_, i) => i + 11).map((age) => (
									<SelectItem key={age} value={age.toString()}>
										{age}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Season Filter - Shows all available seasons */}
						{/* No longer filtered by gender since seasons are gender-independent */}
						<Select value={selectedSeason} onValueChange={setSelectedSeason}>
							<SelectTrigger>
								<SelectValue placeholder="All Seasons" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Seasons</SelectItem>
								{/* 
                  Display all available seasons
                */}
								{seasons.map((season) => (
									<SelectItem key={season.id} value={season.id}>
										{season.season}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Result Filter - Win/Loss/Draw */}
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

						{/* Clear All Filters Button */}
						<Button variant="outline" onClick={onClearFilters}>
							Clear Filters
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
