import { columnHelper } from "./helper"

import type { LogTableRow } from "@/app/logs/types"

function getUserDisplayName(
  user: LogTableRow["actor"],
) {
  if (!user) {
    return "Unknown user"
  }

  const fullName = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    fullName ||
    user.name ||
    user.username ||
    "Unknown user"
  )
}

export const actorColumn = columnHelper.accessor(
  (row): unknown => getUserDisplayName(row.actor),
  {
    id: "actor",
    header: "Who",

    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {getUserDisplayName(row.original.actor)}
        </span>

        {row.original.actor?.username ? (
          <span className="text-xs text-muted-foreground">
            @{row.original.actor.username}
          </span>
        ) : null}
      </div>
    ),

    sortFn: "text",
    filterFn: "includesString",
  },
)
