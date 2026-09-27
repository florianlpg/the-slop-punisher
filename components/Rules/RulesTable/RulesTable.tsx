"use client";

import * as React from "react";

import { flexRender, useTable, type SortingState } from "@tanstack/react-table";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import { AddRuleDialog } from "@/components/Rules/RulesTable/AddRulesDialog";
import { columns } from "@/components/Rules/RulesTable/columns";
import { features } from "@/components/Rules/RulesTable/RulesTableFeatures";

import { type RuleTableRow } from "@/app/rules/types";

export function RulesTable() {
  const rules = useQuery(api.rules.list);
  const totalMembers = useQuery(api.users.count);

  const data: RuleTableRow[] =
    rules && totalMembers !== undefined
      ? rules.map((rule) => ({
          ...rule,
          totalMembers,
        }))
      : [];

  console.log(rules);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useTable({
    features,
    data: data.filter((fn) => fn.status !== "archived"),
    columns,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rules</h1>

          <p className="text-sm text-muted-foreground">
            Manage the penalties and rules that apply to everyone.
          </p>
        </div>

        <AddRuleDialog />
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rules === undefined || totalMembers === undefined ? (
              Array.from({
                length: 5,
              }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No rules yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
