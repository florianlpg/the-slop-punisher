"use client";

import * as React from "react";

import { flexRender, useTable, type SortingState } from "@tanstack/react-table";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { columns } from "./columns";
import { features } from "./ApprobationsTableFeatures";

import type { ApprobationTableRow } from "@/app/approbations/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getUserDisplayName(
  user: {
    firstName?: string;
    lastName?: string;
    name?: string;
    username?: string;
  } | null,
) {
  if (!user) {
    return "Unknown user";
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return fullName || user.name || user.username || "Unknown user";
}

export function ApprobationsTable() {
  const infractions = useQuery(api.infractions.approvals);

  const data: ApprobationTableRow[] =
    infractions?.map((infraction) => ({
      _id: infraction._id,
      ruleId: infraction.ruleId,
      accusedUserId: infraction.accusedUserId,
      reportedBy: infraction.reportedBy,
      quantity: infraction.quantity,
      amountCents: infraction.amountCents,
      note: infraction.note,
      status: infraction.status,
      createdAt: infraction.createdAt,

      description: infraction.rule?.description ?? "Unknown rule",

      accusedName: getUserDisplayName(infraction.accusedUser),

      reporterName: getUserDisplayName(infraction.reporterUser),

      yesVotes: infraction.yesVotes,
      noVotes: infraction.noVotes,

      requiredApprovals: infraction.requiredApprovals,

      currentUserVote: infraction.currentUserVote,
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

  if (infractions === undefined) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h1 className="text-2xl font-semibold">Approvals</h1>

          <p className="text-sm text-muted-foreground">
            Review and approve pending penalties.
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Accused</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead>Amount</TableHead>
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
        <div>
          <h1 className="text-2xl font-semibold">Approvals</h1>

          <p className="text-sm text-muted-foreground">
            Review and approve pending penalties.
          </p>
        </div>

        <div className="flex min-h-64 items-center justify-center rounded-md border">
          <div className="text-center">
            <p className="font-medium">No pending approvals</p>

            <p className="mt-1 text-sm text-muted-foreground">
              There are currently no penalties waiting for review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Approvals</h1>

        <p className="text-sm text-muted-foreground">
          Review and approve pending penalties.
        </p>
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
