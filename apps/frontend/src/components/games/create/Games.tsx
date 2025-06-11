import { GameInsert } from '@wirralbears/backend-types';
import GameComponent from './Game';

interface GamesComponentProps {
  games: (GameInsert & { tempId?: string })[];
  seasons: Array<{ id: string; season: string }>;
  blogs: Array<{ id: string; title: string }>;
  onUpdateGame: (gameId: string | undefined, updatedGame: GameInsert & { tempId?: string }) => void;
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
