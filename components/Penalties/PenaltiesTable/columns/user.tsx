"use client"

import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import { columnHelper } from "./helper"

function getUserName(
  user:
    | {
        firstName?: string
        lastName?: string
        name?: string
        username?: string
      }
    | null,
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

export const userColumn = columnHelper.accessor(
  (row) => getUserName(row.accusedUser),
  {
    id: "user",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(
            column.getIsSorted() === "asc",
          )
        }
      >
        User
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{getUserName(row.original.accusedUser)}</span>
    ),
    sortFn: "text",
  },
)
