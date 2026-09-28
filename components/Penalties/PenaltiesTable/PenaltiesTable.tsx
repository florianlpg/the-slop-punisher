"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

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

    const searchTerm = search.trim().toLocaleLowerCase();

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

      if (searchTerm) {
        const searchableValues = [
          penalty.rule?.description,
          penalty.accusedUser?.name,
          penalty.accusedUser?.username,
          penalty.reporterUser?.name,
          penalty.reporterUser?.username,
          penalty.status,
          penalty.note,
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
  }, [penalties, ruleFilter, userFilter, reporterFilter, statusFilter, search]);

  const pageCount = Math.ceil(filteredPenalties.length / pageSize);
  const currentPageIndex = Math.min(pageIndex, Math.max(pageCount - 1, 0));
  const paginatedPenalties = filteredPenalties.slice(
    currentPageIndex * pageSize,
    (currentPageIndex + 1) * pageSize,
  );
  const pageStart =
    filteredPenalties.length === 0 ? 0 : currentPageIndex * pageSize + 1;
  const pageEnd = Math.min(
    (currentPageIndex + 1) * pageSize,
    filteredPenalties.length,
  );

  const hasFilters =
    ruleFilter !== "all" ||
    userFilter !== "all" ||
    reporterFilter !== "all" ||
    statusFilter !== "all" ||
    search !== "";

  const clearFilters = () => {
    setRuleFilter("all");
    setUserFilter("all");
    setReporterFilter("all");
    setStatusFilter("all");
    setSearch("");
    setPageIndex(0);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Penalties</h1>

        <p className="text-muted-foreground">
          Review and filter every penalty recorded in the application.
        </p>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPageIndex(0);
          }}
          placeholder="Search penalties..."
          aria-label="Search penalties"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Rule</label>

          <select
            value={ruleFilter}
            onChange={(event) => { setRuleFilter(event.target.value); setPageIndex(0); }}
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
            onChange={(event) => { setUserFilter(event.target.value); setPageIndex(0); }}
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
            onChange={(event) => { setReporterFilter(event.target.value); setPageIndex(0); }}
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
            onChange={(event) => { setStatusFilter(event.target.value); setPageIndex(0); }}
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
            {paginatedPenalties.map((penalty) => (
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

      {penalties !== undefined && (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{filteredPenalties.length === 0 ? "No penalties to show" : `Showing ${pageStart}–${pageEnd} of ${filteredPenalties.length} penalties`}</span>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button type="button" variant="outline" size="sm" onClick={() => setPageIndex((page) => Math.max(page - 1, 0))} disabled={currentPageIndex === 0} aria-label="Previous page"><ChevronLeft />Previous</Button>
            <span className="min-w-20 text-center tabular-nums">Page {pageCount === 0 ? 0 : currentPageIndex + 1} of {pageCount}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => setPageIndex((page) => Math.min(page + 1, Math.max(pageCount - 1, 0)))} disabled={currentPageIndex >= pageCount - 1} aria-label="Next page">Next<ChevronRight /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
