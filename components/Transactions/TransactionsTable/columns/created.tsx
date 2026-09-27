import { columnHelper } from "./helper"

export const createdColumn = columnHelper.accessor(
  (row): unknown => row.createdAt,
  {
    id: "created",
    header: "Created",

    cell: ({ row }) =>
      new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(row.original.createdAt)),

    sortFn: "alphanumeric",
  },
)
