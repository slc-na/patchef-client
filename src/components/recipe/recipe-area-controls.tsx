import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useCommandStore } from '@/hooks/use-command-store';
import { SquareTerminal, Trash } from 'lucide-react';
import ClearAlertDialogContent from '@/components/recipe/clear-alert-dialog-content';

const RecipeAreaControls = () => {
  const { destinationCommands } = useCommandStore();

  const isEmpty = destinationCommands.length === 0;

  return (
    <div className="flex items-center gap-x-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={isEmpty}
            variant="outline"
            className="flex items-center justify-center gap-x-2"
          >
            <Trash className="size-4" />
            Clear
          </Button>
        </AlertDialogTrigger>
        <ClearAlertDialogContent />
      </AlertDialog>
      <Button
        disabled={isEmpty}
        className="flex items-center justify-center gap-x-2"
      >
        <SquareTerminal className="size-4" />
        Preview
      </Button>
    </div>
  );
};

export default RecipeAreaControls;
