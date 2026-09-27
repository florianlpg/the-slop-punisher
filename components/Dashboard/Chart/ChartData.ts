import {
  getNextPoint,
  getRangeEnd,
  getRangeStart,
} from "./ChartUtils"

import type {
  ChartData,
  ChartPoint,
  TimeRange,
} from "./CharTypes"

function getInitialPoints(
  start: Date,
  end: Date,
  timeRange: TimeRange,
) {
  const points: ChartPoint[] = []

  let current = new Date(start)

  while (current <= end) {
    points.push({
      date: current.toISOString(),
    })

    current = getNextPoint(
      current,
      timeRange,
    )
  }

  return points
}

export function buildChartData(
  data: ChartData,
  timeRange: TimeRange,
  now: Date,
) {
  const rangeStart = getRangeStart(
    now,
    timeRange,
  )

  const rangeEnd = getRangeEnd(
    now,
    timeRange,
  )

  const points = getInitialPoints(
    rangeStart,
    rangeEnd,
    timeRange,
  )

  /*
   * A penalty increases a user's balance.
   * A payment decreases it.
   */
  const events = [
    ...data.infractions.map(
      (infraction) => ({
        userId:
          infraction.userId,
        amountCents:
          infraction.amountCents,
        createdAt:
          infraction.createdAt,
      }),
    ),

    ...data.transactions.map(
      (transaction) => ({
        userId:
          transaction.userId,
        amountCents:
          -transaction.amountCents,
        createdAt:
          transaction.createdAt,
      }),
    ),
  ]
    .filter(
      (event) =>
        event.createdAt <=
        rangeEnd.getTime(),
    )
    .sort(
      (a, b) =>
        a.createdAt -
        b.createdAt,
    )

  /*
   * Start each user at zero.
   */
  const currentValues = new Map<
    string,
    number
  >()

  for (const user of data.users) {
    currentValues.set(
      user.id,
      0,
    )
  }

  /*
   * Calculate each user's balance
   * before the selected range.
   *
   * This means the graph starts with
   * the actual balance at the beginning
   * of the selected period.
   */
  for (const event of events) {
    if (
      event.createdAt >=
      rangeStart.getTime()
    ) {
      break
    }

    const current =
      currentValues.get(
        event.userId,
      ) ?? 0

    currentValues.set(
      event.userId,
      current +
        event.amountCents,
    )
  }

  let eventIndex = 0

  const result: ChartPoint[] = []

  for (const point of points) {
    const pointDate =
      new Date(point.date)

    /*
     * Apply all events that happened
     * before or at this point.
     */
    while (
      eventIndex <
        events.length &&
      events[eventIndex]
        .createdAt <=
        pointDate.getTime()
    ) {
      const event =
        events[eventIndex]

      const current =
        currentValues.get(
          event.userId,
        ) ?? 0

      currentValues.set(
        event.userId,
        current +
          event.amountCents,
      )

      eventIndex += 1
    }

    const chartPoint: ChartPoint = {
      date: point.date,
    }

    for (const user of data.users) {
      chartPoint[user.id] =
        currentValues.get(
          user.id,
        ) ?? 0
    }

    result.push(chartPoint)
  }

  /*
   * Future points contain no future events,
   * so they naturally remain at the current
   * balance.
   *
   * Example:
   *
   * Current balance: €150
   *
   * 14:00 -> €150
   * 15:00 -> €150
   * 16:00 -> €150
   * ...
   * 23:00 -> €150
   */
  return result
}
