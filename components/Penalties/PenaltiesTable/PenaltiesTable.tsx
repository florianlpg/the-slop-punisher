"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PenaltiesTable() {
  const penalties = useQuery(api.infractions.list);

  const [ruleFilter, setRuleFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [reporterFilter, setReporterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const rules = useMemo(() => {
    if (!penalties) return [];

    return Array.from(
      new Map(
        penalties
          .filter((penalty) => penalty.rule)
          .map((penalty) => [penalty.ruleId, penalty.rule]),
      ).values(),
    );
  }, [penalties]);

  const users = useMemo(() => {
    if (!penalties) return [];

    return Array.from(
      new Map(
        penalties
          .filter((penalty) => penalty.accusedUser)
          .map((penalty) => [penalty.accusedUserId, penalty.accusedUser]),
      ).values(),
    );
  }, [penalties]);

  const reporters = useMemo(() => {
    if (!penalties) return [];

    return Array.from(
      new Map(
        penalties
          .filter((penalty) => penalty.reporterUser)
          .map((penalty) => [penalty.reportedBy, penalty.reporterUser]),
      ).values(),
    );
  }, [penalties]);

  const filteredPenalties = useMemo(() => {
    if (!penalties) return [];

    return penalties.filter((penalty) => {
      if (ruleFilter !== "all" && penalty.ruleId !== ruleFilter) {
        return false;
      }

      if (userFilter !== "all" && penalty.accusedUserId !== userFilter) {
        return false;
      }

      if (reporterFilter !== "all" && penalty.reportedBy !== reporterFilter) {
        return false;
      }

      if (statusFilter !== "all" && penalty.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [penalties, ruleFilter, userFilter, reporterFilter, statusFilter]);

  const hasFilters =
    ruleFilter !== "all" ||
    userFilter !== "all" ||
    reporterFilter !== "all" ||
    statusFilter !== "all";

  const clearFilters = () => {
    setRuleFilter("all");
    setUserFilter("all");
    setReporterFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Penalties</h1>

        <p className="text-muted-foreground">
          Review and filter every penalty recorded in the application.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Rule</label>

          <select
            value={ruleFilter}
            onChange={(event) => setRuleFilter(event.target.value)}
            className="h-9 min-w-48 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All rules</option>

            {rules.map((rule) => (
              <option key={rule?._id} value={rule?._id}>
                {rule?.description}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">User</label>

          <select
            value={userFilter}
            onChange={(event) => setUserFilter(event.target.value)}
            className="h-9 min-w-48 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All users</option>

            {users.map((user) => (
              <option key={user?.clerkUserId} value={user?.clerkUserId}>
                {user?.name ?? user?.username ?? "Unknown user"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Reporter</label>

          <select
            value={reporterFilter}
            onChange={(event) => setReporterFilter(event.target.value)}
            className="h-9 min-w-48 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All reporters</option>

            {reporters.map((user) => (
              <option key={user?.clerkUserId} value={user?.clerkUserId}>
                {user?.name ?? user?.username ?? "Unknown user"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Status</label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-9 min-w-36 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {hasFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPenalties.map((penalty) => (
              <TableRow key={penalty.id}>
                <TableCell>
                  {penalty.rule?.description ?? "Unknown rule"}
                </TableCell>

                <TableCell>
                  {penalty.accusedUser?.name ??
                    penalty.accusedUser?.username ??
                    "Unknown user"}
                </TableCell>

                <TableCell>
                  {penalty.reporterUser?.name ??
                    penalty.reporterUser?.username ??
                    "Unknown user"}
                </TableCell>

                <TableCell>{penalty.quantity}</TableCell>

                <TableCell>
                  {(penalty.amountCents / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </TableCell>

                <TableCell>
                  <span className="capitalize">{penalty.status}</span>
                </TableCell>

                <TableCell>
                  {new Date(penalty.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}

            {filteredPenalties.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  {penalties === undefined
                    ? "Loading penalties..."
                    : hasFilters
                      ? "No penalties match your filters."
                      : "No penalties have been recorded yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
