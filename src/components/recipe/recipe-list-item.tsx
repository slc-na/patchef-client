import type { Command } from "@/types/command";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContextEventDataType } from "@/types/dnd-context";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CommandIcon, GripVerticalIcon, TriangleAlertIcon } from "lucide-react";
import { RecipeListItemRemoveButton } from "@/components/recipe/recipe-list-item-remove-button";
import { RecipeListItemFillParamsButton } from "@/components/recipe/recipe-list-item-fill-params-button";
import { RecipeListItemPreviewButton } from "@/components/recipe/recipe-list-item-preview-button";
import { useMemo } from "react";
import { useCommandStore } from "@/hooks/use-command-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  checkAllEnabledOptionsParametersAreFilled,
  checkAllRequiredOptionParametersAreFilled,
  checkAllRequiredParametersAreFilled,
  formatOptionParameters,
} from "@/lib/utils";

export interface RecipeListItemProps {
  command: Command;
}

const RecipeListItem = ({ command }: RecipeListItemProps) => {
  const { destinationCommands } = useCommandStore();

  const index = useMemo(() => {
    return destinationCommands.findIndex((c) => c.id === command.id);
  }, [destinationCommands, command.id]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: command.id,
    data: {
      type: DndContextEventDataType.DestinationCommand,
      command,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="h-20 select-none rounded-sm bg-gray-200 dark:bg-gray-800"
      />
    );
  }

  const isParametersAreFilled = checkAllRequiredParametersAreFilled(command);
  const isEnabledOptionParametersAreFilled =
    checkAllEnabledOptionsParametersAreFilled(command);

  const isNotParametersFilled =
    (command.parameters &&
      command.parameters.length !== 0 &&
      !isParametersAreFilled) ||
    !isEnabledOptionParametersAreFilled;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="flex select-none items-center justify-between rounded-sm px-4"
    >
      <div className="flex items-center">
        {/* Represents the Line Number */}
        <div className="flex h-8 w-8 items-center justify-center rounded border text-xs shadow">
          {index + 1}
        </div>
        <div>
          <CardHeader className="pt-4 pb-2">
            <div className="flex items-center gap-x-2">
              <CommandIcon className="size-4" />
              <CardTitle>{command.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {isNotParametersFilled && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-x-1"
                >
                  <TriangleAlertIcon className="size-3 fill-orange-400 text-foreground dark:fill-orange-600" />
                  Parameters not yet filled!
                </Badge>
              )}
              {command.parameters &&
                command.parameters.length !== 0 &&
                command.parameters?.map(
                  (parameter) =>
                    parameter.payload &&
                    parameter.payload !== `[${parameter.name}]` && (
                      <Badge key={parameter.id}>
                        {parameter.name}: {parameter.payload}
                      </Badge>
                    )
                )}
              {command.options &&
                command.options.length !== 0 &&
                command.options?.map(
                  (option) =>
                    option.payload &&
                    checkAllRequiredOptionParametersAreFilled(option) &&
                    option.enabled && (
                      <Badge key={option.id}>
                        {option.name}:&nbsp;
                        {option.parameterRequired
                          ? formatOptionParameters(option.parameters)
                          : "True"}
                      </Badge>
                    )
                )}
            </div>
          </CardContent>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <RecipeListItemFillParamsButton
          command={command}
          commandIndex={index}
        />
        <RecipeListItemPreviewButton command={command} />
        <RecipeListItemRemoveButton command={command} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild={true}>
              <Button
                {...attributes}
                {...listeners}
                variant="ghost"
                className="cursor-grab rounded p-2.5 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <GripVerticalIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hold and drag this command!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export { RecipeListItem };
