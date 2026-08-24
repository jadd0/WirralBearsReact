'use client';

import { PageHeader } from '@components/layout/PageHeader';

interface GamesDisplayHeaderProps {
	totalGames: number;
}

export default function GamesDisplayHeader({
	totalGames,
}: GamesDisplayHeaderProps) {
	return (
		<PageHeader
			eyebrow="Games"
			title="Fixtures & results"
			lead={
				totalGames === 1
					? 'One game on record, with the full result.'
					: `${totalGames} games on record, with results and season breakdowns.`
			}
		/>
	);
}
