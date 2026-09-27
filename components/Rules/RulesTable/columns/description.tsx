"use client"

import { columnHelper } from "./helper"

export const descriptionColumn = columnHelper.accessor("description", {
  header: "Rule",
  cell: ({ getValue }) => (
    <div className="max-w-[420px] whitespace-pre-wrap">{getValue()}</div>
  ),
})
