"use client";

import { columnHelper } from "./helper";

export const quantityColumn = columnHelper.accessor("quantity", {
  header: "Quantity",
  cell: ({ row }) => {
    const { quantity, rule } = row.original;

    if (!rule) {
      return quantity;
    }

    const unit = rule.unit === "custom" ? rule.customUnitLabel : rule.unit;

    return (
      <span>
        {quantity} {unit}
      </span>
    );
  },
});
