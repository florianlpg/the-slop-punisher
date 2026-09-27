"use client";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { columnHelper } from "./helper";

export const createdColumn = columnHelper.accessor("createdAt", {
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Date
      <ArrowUpDown className="ml-2 size-4" />
    </Button>
  ),
  cell: ({ row }) => (
    <span>
      {new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(row.original.createdAt))}
    </span>
  ),
});
