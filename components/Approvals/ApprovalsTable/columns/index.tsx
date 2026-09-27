import { columnHelper } from "./helper"

import { accusedColumn } from "./accused"
import { descriptionColumn } from "./description"
import { amountColumn } from "./amount"
import { createdAtColumn } from "./created-at"
import { approvalsColumn } from "./approvals"
import { actionsColumn } from "./actions"

export const columns = columnHelper.columns([
  accusedColumn,
  descriptionColumn,
  amountColumn,
  approvalsColumn,
  createdAtColumn,
  actionsColumn,
])
