"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyState?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({ data, columns, emptyState }: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [direction, setDirection] = React.useState<"asc" | "desc">("asc");

  const sorted = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue === bValue) return 0;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return direction === "asc" ? -1 : 1;
    });
  }, [data, sortKey, direction]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  if (!data.length && emptyState) {
    return <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">{emptyState}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="min-w-full divide-y divide-border/60 text-sm">
        <thead className="bg-muted/60">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cn("px-4 py-3 text-left font-semibold text-muted-foreground", column.className)}>
                {column.sortable ? (
                  <Button variant="ghost" size="sm" className="-ml-3 gap-2" onClick={() => handleSort(column.key)}>
                    {column.header}
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 bg-background/80">
          {sorted.map((row, index) => (
            <tr key={index} className="transition hover:bg-muted/50">
              {columns.map((column) => (
                <td key={column.key} className={cn("px-4 py-3", column.className)}>
                  {column.render ? column.render(row) : (row[column.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
