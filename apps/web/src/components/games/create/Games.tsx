'use client';

import { Season } from '@/db/schema';
import type { EditableGame } from '@/views/admin/games/GamesCreate.page';
import GameComponent from './Game';

interface GamesComponentProps {
  games: EditableGame[];
  seasons: Season[];
  blogs: Array<{ id: string; title: string }>;
  onUpdateGame: (gameId: string | undefined, updatedGame: EditableGame) => void;
  onDeleteGame: (gameId: string | undefined) => void;
}

export default function GamesComponent({ 
  games, 
  seasons, 
  blogs, 
  onUpdateGame, 
  onDeleteGame 
}: GamesComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      {games.map((game) => (
        <GameComponent
          key={game.id || game.tempId}
          game={game}
          seasons={seasons}
          blogs={blogs}
          onUpdate={onUpdateGame}
          onDelete={onDeleteGame}
        />
      ))}
    </div>
  );
}