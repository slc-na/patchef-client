import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CommandSchema, CommandType } from "@/types/command";
import { useCommandStore } from "@/hooks/use-command-store";
import { ManageState } from "@/types/use-command.store";
import { ArrowRightIcon, XIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { generateDefaultValues } from "@/lib/utils";
import type { EditCommandStepProps } from "@/components/sidebar/edit-command-stepper/edit-command-stepper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeEditorDialog } from "@/components/markdown/code-editor-dialog";

const EditCommandStep1 = ({ next }: EditCommandStepProps) => {
  const { setManageState, draftCommand, setDraftCommand } = useCommandStore();

  const form = useForm<z.infer<typeof CommandSchema>>({
    resolver: zodResolver(CommandSchema),
    defaultValues: generateDefaultValues.command(draftCommand),
  });

  const onSubmit = (values: z.infer<typeof CommandSchema>) => {
    const { id, type, name, description, payload } = values;

    setDraftCommand({
      ...draftCommand,
      id,
      type,
      name,
      description,
      payload,
    });

    next();
  };

  const handleCancelClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();
    form.reset();
    setDraftCommand(null);
    setManageState(ManageState.View);
  };

  return (
    <Form {...form}>
      <form
        noValidate={true}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-2xl flex-col justify-between gap-y-4"
      >
        <div className="flex w-full flex-col gap-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormDescription>
                  The name of the command that users will use to trigger it
                </FormDescription>
                <FormControl>
                  <Input
                    autoComplete="off"
                    autoFocus={true}
                    placeholder="Secure Socket Shell"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormDescription>
                  A brief description of what the command does
                </FormDescription>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Connect to a remote machine via SSH"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormDescription>
                  The type of command that will be executed
                </FormDescription>
                <Select
                  name="create-command-type-select"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={true}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select command type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CommandType.Basic}>Basic</SelectItem>
                    <SelectItem value={CommandType.Advanced}>
                      Advanced
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("type") === CommandType.Basic ? (
            <FormField
              control={form.control}
              name="payload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payload</FormLabel>
                  <FormDescription>
                    The payload of the command that will be executed
                  </FormDescription>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="start chrome"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="space-y-2">
              <h1 className="py-[0.3125rem] font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Payload
              </h1>
              <p className="text-[0.8rem] text-muted-foreground">
                Open the code editor to write the payload of the command
              </p>
              <CodeEditorDialog />
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-4 self-end">
          <Button variant="outline" onClick={handleCancelClick}>
            <XIcon className="mr-2 size-4" />
            Cancel
          </Button>
          <Button type="submit">
            Next
            <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { EditCommandStep1 };
