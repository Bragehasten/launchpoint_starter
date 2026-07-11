"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { CrudResult } from "@/actions/capabilities";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

/**
 * Generic capability CRUD manager.
 *
 * Field definitions describe the form; server actions (passed as props —
 * Next serializes action references) do validated writes. One component
 * powers team, services, locations, and promotions admin — and any future
 * capability gets CRUD for the cost of a field list.
 */

export type CrudFieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "json";

export type CrudField = {
  name: string;
  label: string;
  type: CrudFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** For number fields shown in dollars etc. */
  step?: string;
  hint?: string;
};

export type CrudRecord = { id: string } & Record<string, unknown>;

type CrudManagerProps = {
  title: string;
  records: CrudRecord[];
  fields: CrudField[];
  /** Which fields show as table columns (subset of field names). */
  columns: string[];
  upsertAction: (id: string | null, values: unknown) => Promise<CrudResult>;
  deleteAction: (id: string) => Promise<CrudResult>;
  /** Maps a raw record to form defaults (e.g. cents → dollars). */
  toFormValues?: (record: CrudRecord) => Record<string, unknown>;
  /** Formats a cell for display. */
  renderCell?: (record: CrudRecord, column: string) => React.ReactNode;
};

function defaultFor(field: CrudField): unknown {
  if (field.type === "checkbox") return true;
  if (field.type === "number") return field.name === "sort_order" ? 0 : null;
  return "";
}

export function CrudManager({
  title,
  records,
  fields,
  columns,
  upsertAction,
  deleteAction,
  toFormValues,
  renderCell,
}: CrudManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [values, setValues] = React.useState<Record<string, unknown>>({});

  function openCreate() {
    setEditingId(null);
    setValues(Object.fromEntries(fields.map((field) => [field.name, defaultFor(field)])));
    setOpen(true);
  }

  function openEdit(record: CrudRecord) {
    setEditingId(record.id);
    setValues(toFormValues ? toFormValues(record) : { ...record });
    setOpen(true);
  }

  function setValue(name: string, value: unknown) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await upsertAction(editingId, values);
      if (result.success) {
        toast.success("Saved.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message ?? "Could not save.");
      }
    });
  }

  function handleDelete(record: CrudRecord) {
    if (!window.confirm(`Delete this ${title.toLowerCase().replace(/s$/, "")}?`)) return;
    startTransition(async () => {
      const result = await deleteAction(record.id);
      if (result.success) {
        toast.success("Deleted.");
        router.refresh();
      } else {
        toast.error(result.message ?? "Could not delete.");
      }
    });
  }

  const fieldByName = Object.fromEntries(fields.map((field) => [field.name, field]));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus />
          Add
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{fieldByName[column]?.label ?? column}</TableHead>
              ))}
              <TableHead className="w-24">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record.id}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {renderCell ? renderCell(record, column) : String(record[column] ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => openEdit(record)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        className="hover:text-destructive"
                        onClick={() => handleDelete(record)}
                        disabled={pending}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-muted-foreground h-20 text-center"
                >
                  Nothing yet — add the first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit" : "Add"} {title.toLowerCase().replace(/s$/, "")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {fields.map((field) => {
              const fieldId = `crud-${field.name}`;
              const value = values[field.name];

              if (field.type === "checkbox") {
                return (
                  <label key={field.name} className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => setValue(field.name, e.target.checked)}
                      className="accent-primary size-4"
                    />
                    {field.label}
                  </label>
                );
              }

              return (
                <div key={field.name} className="flex flex-col gap-2">
                  <Label htmlFor={fieldId}>{field.label}</Label>
                  {field.type === "textarea" || field.type === "json" ? (
                    <Textarea
                      id={fieldId}
                      rows={field.type === "json" ? 4 : 3}
                      value={typeof value === "string" ? value : ""}
                      placeholder={field.placeholder}
                      className={field.type === "json" ? "font-mono text-sm" : undefined}
                      onChange={(e) => setValue(field.name, e.target.value)}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={fieldId}
                      value={typeof value === "string" ? value : ""}
                      onChange={(e) => setValue(field.name, e.target.value)}
                      className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                    >
                      <option value="" disabled>
                        {field.placeholder ?? "Select…"}
                      </option>
                      {(field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "number" ? (
                    <Input
                      id={fieldId}
                      type="number"
                      step={field.step}
                      value={value === null || value === undefined ? "" : String(value)}
                      placeholder={field.placeholder}
                      onChange={(e) =>
                        setValue(field.name, e.target.value === "" ? null : Number(e.target.value))
                      }
                    />
                  ) : (
                    <Input
                      id={fieldId}
                      value={typeof value === "string" ? value : ""}
                      placeholder={field.placeholder}
                      onChange={(e) => setValue(field.name, e.target.value)}
                    />
                  )}
                  {field.hint ? (
                    <p className="text-muted-foreground text-xs">{field.hint}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
