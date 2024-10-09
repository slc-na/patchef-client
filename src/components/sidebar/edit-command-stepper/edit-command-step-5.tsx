import { useState } from "react";
import { ArrowLeftIcon, BadgePlusIcon, TerminalIcon } from "lucide-react";
import { Code } from "@/components/markdown/code";
import { Button } from "@/components/ui/button";
import {
  copyDraftCommand,
  generateCodeMarkdown,
  generateCommandString,
} from "@/lib/utils";
import type { Command, CommandParameter } from "@/types/command";
import { useCommandStore } from "@/hooks/use-command-store";
import { ManageState } from "@/types/use-command.store";
import { toast } from "sonner";
import { useImmer } from "use-immer";
import type { EditCommandStepProps } from "@/components/sidebar/edit-command-stepper/edit-command-stepper";
import { EditCommandParametersCombobox } from "@/components/sidebar/edit-command-stepper/edit-command-parameters-combobox";
import { EditCommandOptionsPlaygroundDialog } from "@/components/sidebar/edit-command-stepper/edit-command-options-playground-dialog";

const EditCommandStep5 = ({ prev }: EditCommandStepProps) => {
  const {
    draftCommand,
    setDraftCommand,
    setInitialSourceCommands,
    setSourceCommands,
    setManageState,
  } = useCommandStore();

  /* 
    The preview is generated NOT from the command draft, but from a COPY of it.
    This is to prevent the actual command draft's parameters to be modified and have a payload value
    other than the default, since source commands should not have a custom payload value yet.
  */
  const [draftCommandCopy, setDraftCommandCopy] = useImmer<Command | null>(
    copyDraftCommand(draftCommand),
  );

  const [open, setOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] =
    useState<CommandParameter | null>(null);

  const editCommandParametersComboboxProps = {
    draftCommandCopy,
    setDraftCommandCopy,
    open,
    setOpen,
    selectedParameter,
    setSelectedParameter,
  };

  const codePayload =
    draftCommandCopy && generateCommandString(draftCommandCopy);
  const codeMarkdown =
    codePayload &&
    generateCodeMarkdown({ codePayload, showLineNumbers: false });

  const saveUpdatedCommand = (draftCommand: Command) => {
    setSourceCommands((draft) => {
      const index = draft.findIndex(
        (command) => command.id === draftCommand.id,
      );
      draft[index] = draftCommand;
    });
    setInitialSourceCommands((draft) => {
      const index = draft.findIndex(
        (command) => command.id === draftCommand.id,
      );
      draft[index] = draftCommand;
    });
    setDraftCommand(null);
    setDraftCommandCopy(null);
  };

  const handleSubmit = () => {
    if (!draftCommand) {
      return;
    }

    const commandName = `${draftCommand.name}`;

    /* 
      Finally add the draft command to the source commands list.
    */
    saveUpdatedCommand(draftCommand);
    setManageState(ManageState.View);
    toast.success(`Command updated successfully! - ${commandName}`);
  };

  return (
    <div className="flex h-full w-full max-w-2xl flex-1 flex-col justify-between gap-y-4">
      <div className="flex flex-1 flex-col gap-y-4 text-sm">
        <div className="flex items-center gap-x-4">
          <TerminalIcon className="size-4" />
          Does the following command looks good to you?
        </div>
        <div className="flex flex-col gap-y-2">
          {/* Check using draft command but pass the value of copy of draft command */}
          {draftCommand?.parameters && draftCommand?.options && (
            <div className="text-sm">Command Playground</div>
          )}
          {draftCommand?.parameters && draftCommand.parameters.length !== 0 && (
            <EditCommandParametersCombobox
              {...editCommandParametersComboboxProps}
            />
          )}
          {draftCommand?.options && draftCommand.options.length !== 0 && (
            <EditCommandOptionsPlaygroundDialog
              draftCommandCopy={draftCommandCopy}
              setDraftCommandCopy={setDraftCommandCopy}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-y-2">
          <h1 className="text-sm">Command Preview</h1>
          <p className="text-muted-foreground text-sm">
            Ensure the generated command works by executing it in your terminal.
          </p>
          {codeMarkdown && <Code codeMarkdown={codeMarkdown} />}
        </div>
      </div>
      <div className="flex items-center gap-x-4 self-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            prev();
          }}
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Previous
        </Button>
        <Button onClick={handleSubmit}>
          <BadgePlusIcon className="mr-2 size-4" />
          Save
        </Button>
      </div>
    </div>
  );
};

export { EditCommandStep5 };