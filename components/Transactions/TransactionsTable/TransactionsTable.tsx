"use client";

import * as React from "react";

import { flexRender, useTable, type SortingState } from "@tanstack/react-table";

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

export function TransactionsTable() {
  const transactions = useQuery(api.transactions.list);

  const data: TransactionTableRow[] =
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
    })) ?? [];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

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

  if (table.getRowModel().rows.length === 0) {
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
