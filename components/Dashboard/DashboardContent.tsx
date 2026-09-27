"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { ChartAreaInteractive } from "@/components/Dashboard/Chart/ChartAreaInteractive";
import { MemberBalances } from "@/components/Dashboard/MemberBalances";
import { NeedsAttention } from "@/components/Dashboard/NeedsAttention";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { SectionCards } from "@/components/Dashboard/SectionCards";

export function DashboardContent() {
  const dashboard = useQuery(api.dashboard.overview);

  if (!dashboard) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />

              <div className="mt-2 h-5 w-72 animate-pulse rounded-md bg-muted" />
            </div>

            <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>

            <div className="px-4 lg:px-6">
              <div className="h-[350px] animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

            <p className="text-muted-foreground">
              Overview of your group&apos;s penalties and finances.
            </p>
          </div>

          {/* Stats */}
          <SectionCards stats={dashboard.stats} />

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={dashboard.chart} />
          </div>

          {/* Attention + Activity */}
          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-2">
            <NeedsAttention attention={dashboard.attention} />

            <RecentActivity activities={dashboard.recentActivity} />
          </div>

          {/* Member balances */}
          <div className="px-4 lg:px-6">
            <MemberBalances balances={dashboard.memberBalances} />
          </div>
        </div>
      </div>
    </div>
  );
}
