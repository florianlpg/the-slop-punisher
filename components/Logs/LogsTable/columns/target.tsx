import type { LogTableRow } from "@/app/logs/types"

import { columnHelper } from "./helper"

function getUserDisplayName(
  user: LogTableRow["targetUser"],
) {
  if (!user) {
    return null
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

export const targetColumn = columnHelper.accessor(
  (row): unknown =>
    row.targetUser
      ? getUserDisplayName(row.targetUser) ?? ""
      : row.entityId ?? "",
  {
    id: "target",
    header: "Target",

    cell: ({ row }) => {
      const targetUser = getUserDisplayName(
        row.original.targetUser,
      )

      if (targetUser) {
        return (
          <span className="font-medium">
            {targetUser}
          </span>
        )
      }

      return (
        <span className="text-muted-foreground">
          {row.original.entityId ?? "—"}
        </span>
      )
    },

    sortFn: "text",
    filterFn: "includesString",
  },
)
