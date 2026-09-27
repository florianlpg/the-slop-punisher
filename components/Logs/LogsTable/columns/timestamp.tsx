import { columnHelper } from "./helper"

export const timestampColumn =
  columnHelper.accessor(
    (row): unknown => row.createdAt,
    {
      id: "timestamp",
      header: "When",

      cell: ({ row }) =>
        new Intl.DateTimeFormat(
          "fr-FR",
          {
            dateStyle: "medium",
            timeStyle: "short",
          },
        ).format(
          new Date(
            row.original.createdAt,
          ),
        ),

      sortFn: "alphanumeric",
    },
  )
