import { columnHelper } from "./helper";

export const approvalsColumn = columnHelper.accessor(
  (row): unknown => row.yesVotes,
  {
    id: "approvals",
    header: "Approvals",

    cell: ({ row }) => {
      const { yesVotes, requiredApprovals } = row.original;

      return (
        <span>
          {yesVotes} / {requiredApprovals}
        </span>
      );
    },

    sortFn: "alphanumeric",
  },
);
