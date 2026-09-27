"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  Clock3Icon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardStats = {
  totalOutstandingCents: number;
  totalCollectedCents: number;
  pendingApprovals: number;
  memberCount: number;
};

type SectionCardsProps = {
  stats: DashboardStats;
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total owed</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.totalOutstandingCents)}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <ArrowDownIcon />
              Outstanding
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total collected</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.totalCollectedCents)}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <ArrowUpIcon />
              Cash
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending approval</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.pendingApprovals}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <Clock3Icon />
              Review
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Members</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.memberCount}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <UsersIcon />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
