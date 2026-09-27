"use client"

import { Badge } from "@/components/ui/badge"

import { columnHelper } from "./helper"

export const statusColumn = columnHelper.accessor(
  "status",
  {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <Badge variant="outline">
          {status}
        </Badge>
      )
    },
  },
)
