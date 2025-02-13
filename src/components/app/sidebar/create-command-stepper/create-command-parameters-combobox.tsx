import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type {
  CreateCommandParameterDto,
  CreateCommandDto,
} from "@/types/commands/command.dto";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { type ChangeEvent, useState } from "react";

interface CreateCommandParametersComboboxProps {
  draftCommandCopy: CreateCommandDto | null;
  setDraftCommandCopy: (command: CreateCommandDto | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedParameter: CreateCommandParameterDto | null;
  setSelectedParameter: (parameter: CreateCommandParameterDto | null) => void;
}

const CreateCommandParametersCombobox = ({
  draftCommandCopy,
  setDraftCommandCopy,
  open,
  setOpen,
  selectedParameter,
  setSelectedParameter,
}: CreateCommandParametersComboboxProps) => {
  const initialParameterIndex = draftCommandCopy?.parameters?.findIndex(
    (parameter) => parameter.id === selectedParameter?.id,
  );

  const [parameterIndex, setParameterIndex] = useState(initialParameterIndex);

  const parameterPayload =
    parameterIndex !== undefined && parameterIndex !== -1
      ? draftCommandCopy?.parameters?.[parameterIndex]?.payload
      : "";

  const handleParameterPayloadOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (
      !draftCommandCopy?.parameters ||
      parameterIndex === -1 ||
      parameterIndex === undefined
    ) {
      return;
    }

    const modifiedCommandParameters = [...draftCommandCopy.parameters];

    modifiedCommandParameters[parameterIndex] = {
      ...modifiedCommandParameters[parameterIndex],
      payload: value,
    };

    const modifiedDraftCommand: CreateCommandDto = {
      ...draftCommandCopy,
      parameters: [...modifiedCommandParameters],
    };

    setDraftCommandCopy(modifiedDraftCommand);
  };

  const hasNoParameters = !draftCommandCopy?.parameters?.length;

  return (
    <div className="flex items-center gap-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild={true}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[11.75rem] justify-between"
            disabled={hasNoParameters}
          >
            {selectedParameter
              ? draftCommandCopy?.parameters?.find(
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
                {draftCommandCopy?.parameters?.map((parameter) => (
                  <CommandItem
                    key={parameter.id}
                    value={parameter.id}
                    onSelect={(currentParameterId) => {
                      setSelectedParameter(
                        currentParameterId === selectedParameter?.id
                          ? null
                          : parameter,
                      );

                      const newParameterIndex =
                        draftCommandCopy?.parameters?.findIndex(
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
  type CreateCommandParametersComboboxProps,
  CreateCommandParametersCombobox,
};
