import type { TimeRange } from "./CharTypes"

export function startOfDay(date: Date) {
  const result = new Date(date)

  result.setHours(0, 0, 0, 0)

  return result
}

export function endOfDay(date: Date) {
  const result = new Date(date)

  result.setHours(
    23,
    59,
    59,
    999,
  )

  return result
}

export function startOfHour(date: Date) {
  const result = new Date(date)

  result.setMinutes(
    0,
    0,
    0,
  )

  return result
}

export function startOfMonth(date: Date) {
  const result = new Date(date)

  result.setDate(1)
  result.setHours(
    0,
    0,
    0,
    0,
  )

  return result
}

export function addDays(
  date: Date,
  days: number,
) {
  const result = new Date(date)

  result.setDate(
    result.getDate() + days,
  )

  return result
}

export function addMonths(
  date: Date,
  months: number,
) {
  const result = new Date(date)

  result.setMonth(
    result.getMonth() + months,
  )

  return result
}

export function getRangeStart(
  now: Date,
  timeRange: TimeRange,
) {
  switch (timeRange) {
    case "today":
      return startOfDay(now)

    case "7d":
      return startOfDay(
        addDays(now, -6),
      )

    case "30d":
      return startOfDay(
        addDays(now, -29),
      )

    case "90d":
      return startOfDay(
        addDays(now, -89),
      )

    case "1y": {
      const result = startOfMonth(now)

      result.setMonth(
        result.getMonth() - 11,
      )

      return result
    }
  }
}

export function getRangeEnd(
  now: Date,
  timeRange: TimeRange,
) {
  switch (timeRange) {
    case "today":
      return endOfDay(now)

    case "7d":
      return endOfDay(
        addDays(now, 6),
      )

    case "30d":
      return endOfDay(
        addDays(now, 29),
      )

    case "90d":
      return endOfDay(
        addDays(now, 89),
      )

    case "1y": {
      const result = startOfMonth(now)

      result.setMonth(
        result.getMonth() + 12,
      )

      result.setDate(0)

      result.setHours(
        23,
        59,
        59,
        999,
      )

      return result
    }
  }
}

export function getNextPoint(
  date: Date,
  timeRange: TimeRange,
) {
  if (timeRange === "today") {
    const result = new Date(date)

    result.setHours(
      result.getHours() + 1,
    )

    return result
  }

  if (timeRange === "1y") {
    return addMonths(date, 1)
  }

  return addDays(date, 1)
}

export function formatCurrency(
  cents: number,
) {
  return new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "EUR",
    },
  ).format(cents / 100)
}

export function formatDate(
  value: string,
  timeRange: TimeRange,
) {
  const date = new Date(value)

  if (timeRange === "today") {
    return date.toLocaleTimeString(
      "fr-FR",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    )
  }

  if (timeRange === "1y") {
    return date.toLocaleDateString(
      "fr-FR",
      {
        month: "short",
        year: "numeric",
      },
    )
  }

  return date.toLocaleDateString(
    "fr-FR",
    {
      month: "short",
      day: "numeric",
    },
  )
}
