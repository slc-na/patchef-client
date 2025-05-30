import { Input } from "@/components/ui/input";
import { defaults } from "@/lib/defaults";
import type { Table } from "@tanstack/react-table";
import { SearchIcon, XIcon } from "lucide-react";

interface CommandDataTableSearchProps<TData> {
  table: Table<TData>;
}

const CommandDataTableSearch = <TData,>({
  table,
}: CommandDataTableSearchProps<TData>) => {
  const query = (table.getColumn("name")?.getFilterValue() as string) ?? "";

  return (
    <form className="flex min-w-80 items-center justify-center gap-x-4">
      <div className="relative w-full">
        <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          name="command-data-table-search"
          placeholder={defaults.placeholders.command.dataTable.search}
          value={query}
          onChange={(e) => {
            table.getColumn("name")?.setFilterValue(e.target.value);
          }}
          className="w-full px-8"
        />
        {query && (
          <XIcon
            className="absolute top-2.5 right-2.5 h-4 w-4 cursor-pointer text-muted-foreground"
            onClick={() => {
              table.getColumn("name")?.setFilterValue("");
            }}
          />
        )}
      </div>
    </form>
  );
};

export { type CommandDataTableSearchProps, CommandDataTableSearch };
