"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { useIsMobile } from "@/hooks/use-mobile"

import { buildChartData } from "./ChartData"
import { createChartConfig } from "./ChartConfig"
import {
  formatCurrency,
  formatDate,
} from "./ChartUtils"

import type {
  ChartAreaInteractiveProps,
  TimeRange,
} from "./CharTypes"

export function ChartAreaInteractive({
  data,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()

  const [timeRange, setTimeRange] =
    React.useState<TimeRange>(
      "30d",
    )

  const [now, setNow] =
    React.useState(
      () => new Date(),
    )

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  /*
   * Keep the "Today" graph moving while
   * the dashboard remains open.
   */
  React.useEffect(() => {
    const interval =
      window.setInterval(() => {
        setNow(new Date())
      }, 60_000)

    return () => {
      window.clearInterval(
        interval,
      )
    }
  }, [])

  const chartData =
    React.useMemo(
      () =>
        buildChartData(
          data,
          timeRange,
          now,
        ),
      [
        data,
        timeRange,
        now,
      ],
    )

  const chartConfig =
    React.useMemo(
      () =>
        createChartConfig(
          data.users,
        ),
      [data.users],
    )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          Member balances
        </CardTitle>

        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Money owed by each member over time
          </span>

          <span className="@[540px]/card:hidden">
            Member balances
          </span>
        </CardDescription>

        <CardAction>
          <ToggleGroup
            multiple={false}
            value={[timeRange]}
            onValueChange={(value) => {
              const nextValue =
                value[0]

              if (
                nextValue ===
                  "today" ||
                nextValue ===
                  "7d" ||
                nextValue ===
                  "30d" ||
                nextValue ===
                  "90d" ||
                nextValue ===
                  "1y"
              ) {
                setTimeRange(
                  nextValue,
                )
              }
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="today">
              Today
            </ToggleGroupItem>

            <ToggleGroupItem value="7d">
              7 days
            </ToggleGroupItem>

            <ToggleGroupItem value="30d">
              30 days
            </ToggleGroupItem>

            <ToggleGroupItem value="90d">
              90 days
            </ToggleGroupItem>

            <ToggleGroupItem value="1y">
              1 year
            </ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (
                value ===
                  "today" ||
                value ===
                  "7d" ||
                value ===
                  "30d" ||
                value ===
                  "90d" ||
                value ===
                  "1y"
              ) {
                setTimeRange(
                  value,
                )
              }
            }}
          >
            <SelectTrigger
              className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem
                value="today"
                className="rounded-lg"
              >
                Today
              </SelectItem>

              <SelectItem
                value="7d"
                className="rounded-lg"
              >
                7 days
              </SelectItem>

              <SelectItem
                value="30d"
                className="rounded-lg"
              >
                30 days
              </SelectItem>

              <SelectItem
                value="90d"
                className="rounded-lg"
              >
                90 days
              </SelectItem>

              <SelectItem
                value="1y"
                className="rounded-lg"
              >
                1 year
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart
            data={chartData}
            margin={{
              left: 8,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={
                timeRange ===
                "today"
                  ? 24
                  : 32
              }
              tickFormatter={(
                value,
              ) =>
                formatDate(
                  value,
                  timeRange,
                )
              }
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                formatCurrency(
                  Number(value),
                )
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(
                    value,
                  ) =>
                    formatDate(
                      value,
                      timeRange,
                    )
                  }
                  formatter={(
                    value,
                    name,
                  ) => {
                    const user =
                      data.users.find(
                        (item) =>
                          item.id ===
                          name,
                      )

                    return (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span>
                          {user?.name ??
                            name}
                        </span>

                        <span className="font-mono font-medium tabular-nums">
                          {formatCurrency(
                            Number(
                              value,
                            ),
                          )}
                        </span>
                      </div>
                    )
                  }}
                  indicator="dot"
                />
              }
            />

            {data.users.map(
              (user) => (
                <Line
                  key={user.id}
                  dataKey={user.id}
                  type="monotone"
                  stroke={
                    user.color
                  }
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                  }}
                  connectNulls
                />
              ),
            )}

            <ChartLegend
              content={
                <ChartLegendContent />
              }
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
