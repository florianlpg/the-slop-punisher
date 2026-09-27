"use client"

import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import { columnHelper } from "./helper"

export const amountColumn = columnHelper.accessor(
  "amountCents",
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(
            column.getIsSorted() === "asc",
          )
        }
      >
        Amount
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.original.amountCents / 100

      return (
        <span className="font-medium">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(amount)}
        </span>
      )
    },
  },
)
