import { Badge } from "@/components/ui/badge";

import type { LogTableRow } from "@/app/logs/types";

import { columnHelper } from "./helper";

const actionLabels: Record<LogTableRow["action"], string> = {
  user_created: "Created user",

  rule_created: "Created rule",
  rule_updated: "Updated rule",
  rule_vote: "Voted on rule",
  rule_confirmed: "Confirmed rule",
  rule_rejected: "Rejected rule",

  infraction_created: "Created infraction",
  infraction_vote: "Voted on infraction",
  infraction_confirmed: "Confirmed infraction",
  infraction_rejected: "Rejected infraction",

  transaction_created: "Created transaction",
  transaction_vote: "Voted on transaction",
  transaction_confirmed: "Confirmed transaction",
  transaction_rejected: "Rejected transaction",

  login: "Logged in",
  logout: "Logged out",
};

const entityLabels: Record<LogTableRow["entityType"], string> = {
  user: "User",
  rule: "Rule",
  infraction: "Infraction",
  transaction: "Transaction",
};

export function getActionLabel(action: LogTableRow["action"]) {
  return actionLabels[action];
}

export function getEntityLabel(entityType: LogTableRow["entityType"]) {
  return entityLabels[entityType];
}

export const actionColumn = columnHelper.accessor(
  (row): unknown => row.action,
  {
    id: "action",
    header: "Action",

    cell: ({ row }) => {
      const action = row.original.action;

      return (
        <div className="flex flex-col items-start gap-1">
          <span className="font-medium">{getActionLabel(action)}</span>

          <Badge variant="secondary" className="text-xs">
            {getEntityLabel(row.original.entityType)}
          </Badge>
        </div>
      );
    },

    sortFn: "text",
    filterFn: "includesString",
  },
);
