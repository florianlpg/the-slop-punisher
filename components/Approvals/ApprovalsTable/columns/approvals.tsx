"use client"

import { columnHelper } from "./helper"

export const approvalsColumn = columnHelper.display({
  id: "approvals",
  header: "Approvals",

  cell: ({ row }) => {
    const {
      yesVotes,
      noVotes,
      requiredApprovals,
    } = row.original

    return (
      <div className="space-y-0.5">
        <div className="font-medium">
          {yesVotes} / {requiredApprovals}
        </div>

        {noVotes > 0 && (
          <div className="text-xs text-muted-foreground">
            {noVotes} rejection{noVotes > 1 ? "s" : ""}
          </div>
        )}
      </div>
    )
  },
})
