import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "@/components/Rules/RulesTable/RulesTableFeatures"
import { type RuleTableRow } from "@/app/rules/types"

export const columnHelper = createColumnHelper<DataTableFeatures, RuleTableRow>()
