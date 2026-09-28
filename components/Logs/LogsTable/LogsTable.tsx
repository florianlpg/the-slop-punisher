"use client";

import * as React from "react";
import { flexRender, useTable, type SortingState } from "@tanstack/react-table";
import { usePaginatedQuery } from "convex/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { api } from "@/convex/_generated/api";
import type { LogTableRow } from "@/app/logs/types";

import { columns } from "./columns";
import { LogsTableFilters, type LogsFilters } from "./LogsTableFilters";
import { features } from "./LogsTableFeatures";
import { getActionLabel, getEntityLabel } from "./columns/action";
import { getLogDetails } from "./columns/details";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const defaultFilters: LogsFilters = {
  actor: "all",
  target: "all",
  action: "all",
  entityType: "all",
  entityId: "",
  vote: "all",
  previousStatus: "all",
  newStatus: "all",
  dateFrom: "",
  dateTo: "",
};

export function LogsTable() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.logs.list,
    {},
    {
      initialNumItems: 50,
    },
  );

  const [filters, setFilters] = React.useState<LogsFilters>(defaultFilters);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");

  const data = React.useMemo<LogTableRow[]>(
    () =>
      results.map((log) => ({
        _id: log._id,
        actorUserId: log.actorUserId,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        targetUserId: log.targetUserId,
        metadata: log.metadata,
        createdAt: log.createdAt,
        actor: log.actor,
        targetUser: log.targetUser,
      })),
    [results],
  );

  const filteredData = React.useMemo(() => {
    const entityId = filters.entityId.trim().toLowerCase();
    const searchTerm = search.trim().toLocaleLowerCase();

    return data.filter((log) => {
      if (filters.actor !== "all" && log.actorUserId !== filters.actor) {
        return false;
      }

      if (filters.target !== "all" && log.targetUserId !== filters.target) {
        return false;
      }

      if (filters.action !== "all" && log.action !== filters.action) {
        return false;
      }

      if (
        filters.entityType !== "all" &&
        log.entityType !== filters.entityType
      ) {
        return false;
      }

      if (entityId && !log.entityId?.toLowerCase().includes(entityId)) {
        return false;
      }

      if (filters.vote !== "all" && log.metadata?.vote !== filters.vote) {
        return false;
      }

      if (
        filters.previousStatus !== "all" &&
        log.metadata?.previousStatus !== filters.previousStatus
      ) {
        return false;
      }

      if (
        filters.newStatus !== "all" &&
        log.metadata?.newStatus !== filters.newStatus
      ) {
        return false;
      }

      if (filters.dateFrom) {
        const from = new Date(`${filters.dateFrom}T00:00:00`);

        if (log.createdAt < from.getTime()) {
          return false;
        }
      }

      if (filters.dateTo) {
        const to = new Date(`${filters.dateTo}T23:59:59.999`);

        if (log.createdAt > to.getTime()) {
          return false;
        }
      }

      if (searchTerm) {
        const actor = getUserLabel(log.actor);
        const target = getUserLabel(log.targetUser);
        const searchableValues = [
          getActionLabel(log.action),
          getEntityLabel(log.entityType),
          getLogDetails(log),
          actor,
          target,
          log.entityId,
        ];

        if (
          !searchableValues.some((value) =>
            value?.toLocaleLowerCase().includes(searchTerm),
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters, search]);

  const table = useTable({
    data: filteredData,
    columns,
    features,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const isLoading = status === "LoadingFirstPage";
  const canLoadMore = status === "CanLoadMore";
  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const pageStart = filteredData.length === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min((pageIndex + 1) * pageSize, filteredData.length);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    table.setPageIndex(0);
  };

  const handleFiltersChange = (nextFilters: LogsFilters) => {
    setFilters(nextFilters);
    table.setPageIndex(0);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Logs</h1>

        <p className="text-muted-foreground">
          See every action performed in the application.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search logs..."
            aria-label="Search logs"
            className="pl-9"
          />
        </div>

        <LogsTableFilters
          data={data}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <div className="text-muted-foreground text-sm">
        {filteredData.length === 0
          ? "No logs to show"
          : `Showing ${pageStart}–${pageEnd} of ${filteredData.length} loaded logs`}
      </div>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-10 px-4 text-left align-middle font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && filteredData.length > 0 ? (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Page {pageIndex + 1} of {pageCount}
          </span>

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
      ) : null}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      ) : null}

      {!isLoading && filteredData.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center text-sm">
          No logs match the current filters.
        </div>
      ) : null}

      {canLoadMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => loadMore(50)}
            variant="outline"
          >
            Load more history
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function getUserLabel(user: LogTableRow["actor"] | LogTableRow["targetUser"]) {
  if (!user) return "";

  return [
    user.name,
    user.username,
    [user.firstName, user.lastName].filter(Boolean).join(" "),
    user.clerkUserId,
  ]
    .filter(Boolean)
    .join(" ");
}
