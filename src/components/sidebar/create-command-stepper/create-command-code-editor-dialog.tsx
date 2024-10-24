import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCommandStore } from "@/hooks/use-command-store";
import GitHubDarkTheme from "@/lib/monaco-editor-themes/github-dark.json";
import GitHubLightTheme from "@/lib/monaco-editor-themes/github-light.json";
import { cn } from "@/lib/utils";
import { generateDefaultValues } from "@/services/commands.service";
import { parseParameters } from "@/services/parser.service";
import type { CreateCommandDto } from "@/types/commands/command.dto";
import Editor, {
  type BeforeMount,
  type OnMount,
  type OnChange,
  type Monaco,
} from "@monaco-editor/react";
import { DialogClose } from "@radix-ui/react-dialog";
import { CodeIcon, RabbitIcon } from "lucide-react";
import { useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import { v4 as generateUuidV4 } from "uuid";

const getTheme = (theme: "light" | "dark" | "system" | undefined) => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme;
};

interface CodeEditorDialogProps {
  form: UseFormReturn<CreateCommandDto>;
}

const CreateCommandCodeEditorDialog = ({ form }: CodeEditorDialogProps) => {
  const { theme } = useTheme();
  const monacoRef = useRef<Monaco | null>(null);
  const { draftCommand, setDraftCommand } = useCommandStore();

  const preventDefault = (e: Event) => {
    e.preventDefault();
  };

  const handleEditorWillMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("GitHubLightTheme", {
      base: "vs-dark",
      inherit: true,
      ...GitHubLightTheme,
    });
    monaco.editor.defineTheme("GitHubDarkTheme", {
      base: "vs-dark",
      inherit: true,
      ...GitHubDarkTheme,
    });
  };

  const handleEditorDidMount: OnMount = (_editor, monaco) => {
    monacoRef.current = monaco;
  };

  const handleEditorChange: OnChange = (value, _event) => {
    const rawValue = value ?? "";
    const parsedParameters = parseParameters(rawValue);

    form.setValue("payload", rawValue);
    setDraftCommand({
      ...(draftCommand ?? generateDefaultValues.draftCommand({ draftCommand })),
      payload: rawValue,
      parameters: parsedParameters.map((parameter) => ({
        id: generateUuidV4(),
        name: parameter,
        description: "None",
        payload: `[${parameter}]`,
      })),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button className="mt-1 w-fit">
          <CodeIcon className="mr-2 size-4" />
          Open Code Editor
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={preventDefault}
        onEscapeKeyDown={preventDefault}
        className="!rounded-md h-full max-h-[48rem] w-full max-w-7xl"
      >
        <DialogHeader>
          <DialogTitle>Advanced Payload Editor</DialogTitle>
          <DialogDescription>
            Write your custom code to generate the payload
          </DialogDescription>
        </DialogHeader>
        <div className="grid flex-1 grid-cols-4 gap-4">
          <div className="col-span-3 rounded-md border bg-white dark:bg-[#24292e]">
            {/* TODO: Fix code editor height only half of the total screen in intial render */}
            <Editor
              defaultLanguage="bat"
              defaultValue={
                draftCommand?.payload ??
                `REM Start your patching journey now!
@echo off
echo Hello, World!
pause`
              }
              onChange={handleEditorChange}
              beforeMount={handleEditorWillMount}
              onMount={handleEditorDidMount}
              theme={
                getTheme(theme as "light" | "dark" | "system" | undefined) ===
                "light"
                  ? "GitHubLightTheme"
                  : "GitHubDarkTheme"
              }
              options={{
                padding: {
                  top: 16,
                  bottom: 16,
                },
                fontSize: 14,
                fontFamily: "Geist Mono",
                fontLigatures: true,
                wordWrap: "on",
                minimap: {
                  enabled: false,
                },
                bracketPairColorization: {
                  enabled: true,
                },
                cursorBlinking: "phase",
                cursorStyle: "block-outline",
                formatOnPaste: true,
                mouseWheelZoom: true,
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          <div className="flex flex-col">
            <ScrollArea className="h-full w-full rounded-md border bg-gray-100 p-2 dark:bg-[#171823]">
              <div className="flex flex-col gap-y-2">
                {draftCommand?.parameters &&
                draftCommand?.parameters?.length !== 0 ? (
                  draftCommand?.parameters?.map((parameter) => (
                    <Card
                      key={parameter.id}
                      className={cn(
                        "flex select-none items-center justify-between rounded-md border p-2 text-sm",
                      )}
                    >
                      {parameter.name}
                    </Card>
                  ))
                ) : (
                  <Card className="flex items-center justify-between rounded-md border-none bg-transparent p-2 text-sm shadow-none outline-none">
                    No parameters added
                    <RabbitIcon className="size-4" />
                  </Card>
                )}
              </div>
            </ScrollArea>
            <div className="flex items-center justify-end gap-x-2">
              <DialogClose asChild={true}>
                <Button className="mt-4">Continue</Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { type CodeEditorDialogProps, CreateCommandCodeEditorDialog };
