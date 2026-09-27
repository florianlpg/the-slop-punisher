import type { TransactionTableRow } from "@/app/transactions/types"

import { columnHelper } from "./helper"

export const userColumn = columnHelper.accessor(
  (row): unknown => row.userDisplayName,
  {
    id: "user",
    header: "User",

    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.userDisplayName}
      </span>
    ),

    sortFn: "text",
    filterFn: "includesString",
  },
)
