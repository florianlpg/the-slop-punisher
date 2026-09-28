"use client";

import * as React from "react";

import { flexRender, useTable, type SortingState } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { columns } from "./columns";
import { features } from "./TransactionsTableFeatures";

import type { TransactionTableRow } from "@/app/transactions/types";

import { AddTransactionDialog } from "@/components/Transactions/AddTransactionDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TransactionsTable() {
  const transactions = useQuery(api.transactions.list);

  const data = React.useMemo<TransactionTableRow[]>(
    () =>
      transactions?.map((transaction) => ({
        _id: transaction._id,
        userId: transaction.userId,
        createdBy: transaction.createdBy,
        amountCents: transaction.amountCents,
        paymentMethod: transaction.paymentMethod,
        status: transaction.status,
        createdAt: transaction.createdAt,
        resolvedAt: transaction.resolvedAt,
        requiredApprovals: transaction.requiredApprovals,
        userDisplayName: transaction.userDisplayName,
        creatorDisplayName: transaction.creatorDisplayName,
        yesVotes: transaction.yesVotes,
        noVotes: transaction.noVotes,
        currentUserVote: transaction.currentUserVote,
      })) ?? [],
    [transactions],
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");
  const visibleData = React.useMemo(() => {
    const searchTerm = search.trim().toLocaleLowerCase();
    return searchTerm
      ? data.filter((transaction) =>
          [
            transaction.userDisplayName,
            transaction.creatorDisplayName,
            transaction.status,
            transaction.paymentMethod,
          ].some((value) => value.toLocaleLowerCase().includes(searchTerm)),
        )
      : data;
  }, [data, search]);

  const table = useTable({
    features,
    data: visibleData,
    columns,
    onSortingChange: setSorting,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    state: {
      sorting,
    },
  });

  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const pageStart = visibleData.length === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min((pageIndex + 1) * pageSize, visibleData.length);

  if (transactions === undefined) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Transactions</h1>

            <p className="text-sm text-muted-foreground">
              Record and review cash payments.
            </p>
          </div>

          <AddTransactionDialog />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approvals</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Transactions</h1>

            <p className="text-sm text-muted-foreground">
              Record and review cash payments.
            </p>
          </div>

          <AddTransactionDialog />
        </div>

        <div className="flex min-h-64 items-center justify-center rounded-md border">
          <div className="text-center">
            <p className="font-medium">No transactions</p>

            <p className="mt-1 text-sm text-muted-foreground">
              No cash transactions have been recorded yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>

          <p className="text-sm text-muted-foreground">
            Record and review cash payments.
          </p>
        </div>

        <AddTransactionDialog />
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            table.setPageIndex(0);
          }}
          placeholder="Search transactions..."
          aria-label="Search transactions"
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
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
            {table.getRowModel().rows.length ? (
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
                  className="h-24 text-center text-muted-foreground"
                >
                  No transactions match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          {visibleData.length === 0
            ? "No transactions to show"
            : `Showing ${pageStart}–${pageEnd} of ${visibleData.length} transactions`}
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
    </div>
  );
}
