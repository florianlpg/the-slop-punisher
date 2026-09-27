"use client"

import * as React from "react"
import {
  flexRender,
  useTable,
  type SortingState,
} from "@tanstack/react-table"
import { usePaginatedQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import type { LogTableRow } from "@/app/logs/types"

import { columns } from "./columns"
import {
  LogsTableFilters,
  type LogsFilters,
} from "./LogsTableFilters"
import { features } from "./LogsTableFeatures"

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
}

export function LogsTable() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.logs.list,
    {},
    {
      initialNumItems: 50,
    },
  )

  const [filters, setFilters] =
    React.useState<LogsFilters>(defaultFilters)

  const [sorting, setSorting] =
    React.useState<SortingState>([])

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
  )

  const filteredData = React.useMemo(() => {
    const entityId = filters.entityId
      .trim()
      .toLowerCase()

    return data.filter((log) => {
      if (
        filters.actor !== "all" &&
        log.actorUserId !== filters.actor
      ) {
        return false
      }

      if (
        filters.target !== "all" &&
        log.targetUserId !== filters.target
      ) {
        return false
      }

      if (
        filters.action !== "all" &&
        log.action !== filters.action
      ) {
        return false
      }

      if (
        filters.entityType !== "all" &&
        log.entityType !== filters.entityType
      ) {
        return false
      }

      if (
        entityId &&
        !log.entityId?.toLowerCase().includes(entityId)
      ) {
        return false
      }

      if (
        filters.vote !== "all" &&
        log.metadata?.vote !== filters.vote
      ) {
        return false
      }

      if (
        filters.previousStatus !== "all" &&
        log.metadata?.previousStatus !==
          filters.previousStatus
      ) {
        return false
      }

      if (
        filters.newStatus !== "all" &&
        log.metadata?.newStatus !== filters.newStatus
      ) {
        return false
      }

      if (filters.dateFrom) {
        const from = new Date(
          `${filters.dateFrom}T00:00:00`,
        )

        if (log.createdAt < from.getTime()) {
          return false
        }
      }

      if (filters.dateTo) {
        const to = new Date(
          `${filters.dateTo}T23:59:59.999`,
        )

        if (log.createdAt > to.getTime()) {
          return false
        }
      }

      return true
    })
  }, [data, filters])

  const table = useTable({
    data: filteredData,
    columns,
    features,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  const isLoading = status === "LoadingFirstPage"
  const canLoadMore = status === "CanLoadMore"

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Logs
        </h1>

        <p className="text-muted-foreground">
          See every action performed in the application.
        </p>
      </div>

      <LogsTableFilters
        data={data}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="text-muted-foreground text-sm">
        Showing {filteredData.length} of {data.length} logs
      </div>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b bg-muted/50"
              >
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
                  <td
                    key={cell.id}
                    className="px-4 py-3 align-middle"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          <button
            type="button"
            onClick={() => loadMore(50)}
            className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  )
}
