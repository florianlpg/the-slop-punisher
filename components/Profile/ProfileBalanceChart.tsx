"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { buildChartData } from "@/components/Dashboard/Chart/ChartData";
import { createChartConfig } from "@/components/Dashboard/Chart/ChartConfig";
import {
  formatCurrency,
  formatDate,
} from "@/components/Dashboard/Chart/ChartUtils";
import type {
  ChartData,
  TimeRange,
} from "@/components/Dashboard/Chart/CharTypes";

type ProfileBalanceChartProps = {
  data: ChartData;
};

export function ProfileBalanceChart({ data }: ProfileBalanceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [now, setNow] = useState(() => new Date());

  const chartData = useMemo(
    () => buildChartData(data, timeRange, now),
    [data, timeRange, now],
  );

  const chartConfig = useMemo(
    () => createChartConfig(data.users),
    [data.users],
  );

  const user = data.users[0];

  if (!user) {
    return null;
  }

  const handleToggleTimeRangeChange = (values: string[]) => {
    const value = values[0];

    if (
      value === "today" ||
      value === "7d" ||
      value === "30d" ||
      value === "90d" ||
      value === "1y"
    ) {
      setTimeRange(value);
      setNow(new Date());
    }
  };

  const handleSelectTimeRangeChange = (value: TimeRange | null) => {
    if (value) {
      setTimeRange(value);
      setNow(new Date());
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>My balance</CardTitle>

        <CardDescription>Your balance over time</CardDescription>

        <CardAction>
          <ToggleGroup
            value={[timeRange]}
            onValueChange={handleToggleTimeRangeChange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="today">Today</ToggleGroupItem>

            <ToggleGroupItem value="7d">7d</ToggleGroupItem>

            <ToggleGroupItem value="30d">30d</ToggleGroupItem>

            <ToggleGroupItem value="90d">90d</ToggleGroupItem>

            <ToggleGroupItem value="1y">1y</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={handleSelectTimeRangeChange}>
            <SelectTrigger
              className="flex w-32 @[767px]/card:hidden"
              aria-label="Select time range"
            >
              <SelectValue placeholder="30d" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="today">Today</SelectItem>

              <SelectItem value="7d">7d</SelectItem>

              <SelectItem value="30d">30d</SelectItem>

              <SelectItem value="90d">90d</SelectItem>

              <SelectItem value="1y">1y</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatDate(value, timeRange)}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value)}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDate(value, timeRange)}
                  formatter={(value) => (
                    <div className="flex w-full items-center gap-2">
                      <span className="text-muted-foreground">Balance</span>

                      <span className="ml-auto font-mono font-medium tabular-nums">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />

            <Line
              dataKey={user.id}
              type="monotone"
              stroke={user.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ProfileBalanceChartSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>

          <Skeleton className="h-9 w-32" />
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[250px] w-full">
          <div className="flex h-full gap-3">
            <div className="flex flex-col justify-between py-2">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-0 flex flex-col justify-between">
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-px w-full" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
