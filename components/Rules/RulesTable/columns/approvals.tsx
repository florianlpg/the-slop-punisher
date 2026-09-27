"use client"

import { columnHelper } from "./helper"

export const requiredApprovalsColumn = columnHelper.accessor("requiredApprovalsToConfirm", {
  header: "Approvals needed",
  cell: ({ getValue }) => (
    <div>
      <span className="font-medium tabular-nums">{getValue()}</span>{" "}
      <span className="text-muted-foreground text-xs">votes to confirm</span>
    </div>
  ),
})
