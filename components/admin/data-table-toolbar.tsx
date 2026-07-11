import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type DataTableToolbarProps = {
  /** Route the search form submits to (GET). */
  action: string;
  placeholder?: string;
  /** Current query value, echoed back into the input. */
  defaultValue?: string;
};

/**
 * Server-driven table search: a plain GET form that updates the `q` search
 * param. Works without JavaScript; the page re-renders with filtered data.
 */
export function DataTableToolbar({
  action,
  placeholder = "Search…",
  defaultValue,
}: DataTableToolbarProps) {
  return (
    <form action={action} method="GET" role="search" className="relative max-w-sm flex-1">
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input
        type="search"
        name="q"
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-label={placeholder}
        className="pl-9"
      />
    </form>
  );
}
