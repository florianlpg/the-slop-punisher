"use client";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { columnHelper } from "./helper";

export const ruleColumn = columnHelper.accessor(
  (row) => row.rule?.description ?? "Unknown rule",
  {
    id: "rule",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rule
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[320px] truncate font-medium">
        {row.original.rule?.description ?? "Unknown rule"}
      </div>
    ),
    sortFn: "text",
  },
);
