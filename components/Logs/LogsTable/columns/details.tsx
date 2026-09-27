import type { LogTableRow } from "@/app/logs/types"

import { columnHelper } from "./helper"

function formatAmount(
  amountCents: number,
) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100)
}

export function getLogDetails(
  log: LogTableRow,
): string {
  const metadata = log.metadata

  if (!metadata) {
    return "—"
  }

  if (metadata.vote) {
    return metadata.vote === "yes"
      ? "Voted yes"
      : "Voted no"
  }

  if (metadata.amountCents !== undefined) {
    return formatAmount(
      metadata.amountCents,
    )
  }

  if (metadata.description) {
    return metadata.description
  }

  if (metadata.quantity !== undefined) {
    return `Quantity: ${metadata.quantity}`
  }

  if (
    metadata.previousStatus &&
    metadata.newStatus
  ) {
    return `${metadata.previousStatus} → ${metadata.newStatus}`
  }

  return "—"
}

export const detailsColumn = columnHelper.accessor(
  (row): unknown => getLogDetails(row),
  {
    id: "details",
    header: "Details",

    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {getLogDetails(row.original)}
      </span>
    ),

    sortFn: "text",
    filterFn: "includesString",
  },
)
