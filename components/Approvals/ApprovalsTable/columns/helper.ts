import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "../ApprobationsTableFeatures";
import type { ApprobationTableRow } from "@/app/approbations/types";

export const columnHelper = createColumnHelper<
  DataTableFeatures,
  ApprobationTableRow
>();
