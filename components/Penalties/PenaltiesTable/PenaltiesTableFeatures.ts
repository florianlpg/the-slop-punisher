import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table"

export const penaltiesTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,

  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),

  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
})

export type PenaltiesTableFeatures =
  typeof penaltiesTableFeatures
