import { Badge } from "@/components/ui/badge";

import { columnHelper } from "./helper";

export const statusColumn = columnHelper.accessor(
  (row): unknown => row.status,
  {
    id: "status",
    header: "Status",

    cell: ({ row }) => {
      const status = row.original.status;

      return <Badge variant="secondary">{status}</Badge>;
    },

    sortFn: "text",
    filterFn: "includesString",
  },
);
