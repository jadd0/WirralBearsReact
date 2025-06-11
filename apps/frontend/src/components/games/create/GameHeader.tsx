import { Button } from '@/components/ui/button';

interface GamesPageHeaderProps {
  onAddGame: () => void;
  onSaveAllGames: () => void;
  isSaving: boolean;
}

export default function GamesPageHeader({ 
  onAddGame, 
  onSaveAllGames, 
  isSaving 
}: GamesPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 justify-between items-center">
      <h1 className="text-3xl font-bold">Edit Games</h1>
      <div className="space-x-2">
        <Button onClick={onAddGame} variant="outline">
          Add Game
        </Button>
        <Button 
          onClick={onSaveAllGames}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save All Games'}
        </Button>
      </div>
    </div>
  );
}
