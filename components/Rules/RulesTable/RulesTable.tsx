"use client";

import * as React from "react";

import { flexRender, useTable, type SortingState } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AddRuleDialog } from "@/components/Rules/RulesTable/AddRulesDialog";
import { columns } from "@/components/Rules/RulesTable/columns";
import { features } from "@/components/Rules/RulesTable/RulesTableFeatures";

import { type RuleTableRow } from "@/app/rules/types";

export function RulesTable() {
  const rules = useQuery(api.rules.list);
  const totalMembers = useQuery(api.users.count);

  const data = React.useMemo<RuleTableRow[]>(
    () =>
      rules && totalMembers !== undefined
        ? rules.map((rule) => ({
            ...rule,
            totalMembers,
          }))
        : [],
    [rules, totalMembers],
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");

  const visibleRules = React.useMemo(() => {
    const searchTerm = search.trim().toLocaleLowerCase();

    return data.filter((rule) => {
      if (rule.status === "archived") return false;
      if (!searchTerm) return true;

      return [
        rule.description,
        rule.unit === "custom" ? rule.customUnitLabel : rule.unit,
        rule.status,
      ].some((value) => value?.toLocaleLowerCase().includes(searchTerm));
    });
  }, [data, search]);

  const table = useTable({
    features,
    data: visibleRules,
    columns,
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    state: {
      sorting,
    },
  });

  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const pageStart = visibleRules.length === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min((pageIndex + 1) * pageSize, visibleRules.length);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    table.setPageIndex(0);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Rules</h1>

          <p className="text-sm text-muted-foreground">
            Manage the penalties and rules that apply to everyone.
          </p>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search rules..."
              aria-label="Search rules"
              className="pl-9"
            />
          </div>
          <AddRuleDialog />
        </div>
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
                  {search ? "No rules match your search." : "No rules yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {rules !== undefined && totalMembers !== undefined && (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {visibleRules.length === 0
              ? "No rules to show"
              : `Showing ${pageStart}–${pageEnd} of ${visibleRules.length} rules`}
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft />
              Previous
            </Button>
            <span className="min-w-20 text-center tabular-nums">
              Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              Next
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
