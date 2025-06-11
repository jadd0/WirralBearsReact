'use client';

import { Button } from '@/components/ui/button';

interface GamesEmptyStateProps {
	onAddGame: () => void;
}

export default function GamesEmptyState({ onAddGame }: GamesEmptyStateProps) {
	return (
		<div className="text-center py-12">
			<p className="text-muted-foreground mb-4">
				No games found. Add your first game!
			</p>
			<Button onClick={onAddGame}>Add Game</Button>
		</div>
	);
}
