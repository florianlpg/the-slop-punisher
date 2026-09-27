import { createColumnHelper } from "@tanstack/react-table";

import type { LogTableRow } from "@/app/logs/types";

import type { DataTableFeatures } from "../LogsTableFeatures";

export const columnHelper = createColumnHelper<
  DataTableFeatures,
  LogTableRow
>();
