import type { ChartConfig } from "@/components/ui/chart"

import type { ChartUser } from "./CharTypes"

export function createChartConfig(
  users: ChartUser[],
): ChartConfig {
  return Object.fromEntries(
    users.map((user) => [
      user.id,
      {
        label: user.name,
        color: user.color,
      },
    ]),
  )
}
