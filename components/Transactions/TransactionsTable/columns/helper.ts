import { createColumnHelper } from "@tanstack/react-table"

import type { TransactionTableRow } from "@/app/transactions/types"

import type { DataTableFeatures } from "../TransactionsTableFeatures"

export const columnHelper =
  createColumnHelper<DataTableFeatures, TransactionTableRow>()
