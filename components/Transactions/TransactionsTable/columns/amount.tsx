import { columnHelper } from "./helper";

export const amountColumn = columnHelper.accessor(
  (row): unknown => row.amountCents,
  {
    id: "amount",
    header: "Amount",

    cell: ({ row }) =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(row.original.amountCents / 100),

    sortFn: "alphanumeric",
  },
);
