import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useCommandStore } from '@/hooks/use-command-store';
import { SquareTerminalIcon, TrashIcon } from 'lucide-react';
import ClearAlertDialogContent from '@/components/recipe/clear-alert-dialog-content';
import PreviewRecipeDialogContent from './preview-recipe-dialog-content';

const RecipeAreaControls = () => {
  const { destinationCommands } = useCommandStore();

  const isEmpty = destinationCommands.length === 0;

  const { setCommandPreviews } = useCommandStore();

  return (
    <div className="flex items-center gap-x-2">
      <AlertDialog>
        <AlertDialogTrigger asChild={true}>
          <Button
            disabled={isEmpty}
            variant="outline"
            className="flex items-center justify-center gap-x-2"
          >
            <TrashIcon className="size-4" />
            Clear
          </Button>
        </AlertDialogTrigger>
        <ClearAlertDialogContent />
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild={true}>
          <Button
            disabled={isEmpty}
            className="flex items-center justify-center gap-x-2"
            onClick={setCommandPreviews}
          >
            <SquareTerminalIcon className="size-4" />
            Preview
          </Button>
        </AlertDialogTrigger>
        <PreviewRecipeDialogContent />
      </AlertDialog>
    </div>
  );
};

export default RecipeAreaControls;
