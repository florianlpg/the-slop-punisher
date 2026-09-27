"use client"

import { columnHelper } from "./helper"

export const amountColumn = columnHelper.accessor(
  "amountCents",
  {
    header: "Amount",
    cell: ({ row }) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(row.original.amountCents / 100)
    },
  },
)
