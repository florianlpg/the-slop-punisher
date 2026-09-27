import { createColumnHelper } from "@tanstack/react-table"

import type { PenaltyTableRow } from "@/app/penalties/types"

import type { PenaltiesTableFeatures } from "../PenaltiesTableFeatures"

export const columnHelper = createColumnHelper<
  PenaltiesTableFeatures,
  PenaltyTableRow
>()
