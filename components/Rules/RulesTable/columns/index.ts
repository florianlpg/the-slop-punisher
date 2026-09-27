import { columnHelper } from "./helper"
import { descriptionColumn } from "./description"
import { fineColumn } from "./fine"
import { votesColumn } from "./votes"
import { requiredApprovalsColumn } from "./approvals"
import { actionsColumn } from "./actions"

export const columns = columnHelper.columns([
  descriptionColumn,
  fineColumn,
  votesColumn,
  requiredApprovalsColumn,
  actionsColumn,
])
