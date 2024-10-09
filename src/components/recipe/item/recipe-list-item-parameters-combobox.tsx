import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import type { Command as CommandType, CommandParameter } from "@/types/command";
import { useState, type ChangeEvent } from "react";
import { useCommandStore } from "@/hooks/use-command-store";

interface RecipeListItemCommandParametersComboboxProps {
  command: CommandType;
  commandIndex: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedParameter: CommandParameter | null;
  setSelectedParameter: (parameter: CommandParameter | null) => void;
}

const RecipeListItemParametersCombobox = ({
  command,
  commandIndex,
  open,
  setOpen,
  selectedParameter,
  setSelectedParameter,
}: RecipeListItemCommandParametersComboboxProps) => {
  const { setDestinationCommands } = useCommandStore();

  const initialParameterIndex = command.parameters?.findIndex(
    (parameter) => parameter.id === selectedParameter?.id,
  );

  const [parameterIndex, setParameterIndex] = useState(initialParameterIndex);

  const parameterPayload =
    parameterIndex !== undefined && parameterIndex !== -1
      ? command.parameters?.[parameterIndex]?.payload
      : "";

  const handleParameterPayloadOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (
      !command.parameters ||
      parameterIndex === -1 ||
      parameterIndex === undefined
    ) {
      return;
    }

    const modifiedCommandParameters = [...command.parameters];

    modifiedCommandParameters[parameterIndex] = {
      ...modifiedCommandParameters[parameterIndex],
      payload: value,
    };

    const modifiedCommand: CommandType = {
      ...command,
      parameters: [...modifiedCommandParameters],
    };

    setDestinationCommands((draft) => {
      draft[commandIndex] = modifiedCommand;
    });
  };

  return (
    <div className="flex items-center gap-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild={true}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[16rem] justify-between"
          >
            {selectedParameter
              ? command.parameters?.find(
                  (parameter) => parameter.id === selectedParameter.id,
                )?.name
              : "Select parameter..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[11.5rem] p-0">
          <Command>
            <CommandInput placeholder="Search parameter..." />
            <CommandList>
              <CommandEmpty>No parameter found.</CommandEmpty>
              <CommandGroup>
                {command.parameters?.map((parameter) => (
                  <CommandItem
                    key={parameter.id}
                    value={parameter.id}
                    onSelect={(currentParameterId) => {
                      setSelectedParameter(
                        currentParameterId === selectedParameter?.id
                          ? null
                          : parameter,
                      );

                      const newParameterIndex = command.parameters?.findIndex(
                        (parameter) => parameter.id === currentParameterId,
                      );

                      setParameterIndex(newParameterIndex);

                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedParameter?.id === parameter.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {parameter.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        autoComplete="off"
        name="create-command-parameters-combobox-input"
        placeholder="Parameter payload"
        value={selectedParameter ? parameterPayload : ""}
        onChange={handleParameterPayloadOnChange}
        disabled={!selectedParameter}
      />
    </div>
  );
};

export {
  type RecipeListItemCommandParametersComboboxProps,
  RecipeListItemParametersCombobox,
};
