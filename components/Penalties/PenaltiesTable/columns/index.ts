import { amountColumn } from "./amount"
import { createdColumn } from "./created"
import { quantityColumn } from "./quantity"
import { reporterColumn } from "./reporter"
import { ruleColumn } from "./rule"
import { statusColumn } from "./status"
import { userColumn } from "./user"

export const columns = [
  ruleColumn,
  userColumn,
  reporterColumn,
  quantityColumn,
  amountColumn,
  statusColumn,
  createdColumn,
]
