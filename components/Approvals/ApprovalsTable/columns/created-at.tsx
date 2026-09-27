"use client";

import { columnHelper } from "./helper";

export const createdAtColumn = columnHelper.accessor("createdAt", {
  header: "Created",
  cell: ({ getValue }) =>
    new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(getValue())),
});
