"use client"

import { columnHelper } from "./helper"

export const accusedColumn = columnHelper.accessor(
  "accusedName",
  {
    header: "Accused",
    cell: ({ getValue }) => (
      <div className="font-medium">
        {getValue()}
      </div>
    ),
  },
)
