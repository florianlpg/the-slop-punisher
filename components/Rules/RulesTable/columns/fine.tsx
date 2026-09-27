"use client";

import { columnHelper } from "./helper";

const unitLabels: Record<string, string> = {
  occurrence: "per infraction",
  file: "per file",
  row: "per row",
  line: "per line",
  minute: "per minute",
};

function formatEuros(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export const fineColumn = columnHelper.accessor("fineAmountCents", {
  id: "fine",
  header: "Fine",
  cell: ({ row }) => {
    const rule = row.original;
    const unitLabel =
      rule.unit === "custom"
        ? (rule.customUnitLabel ?? "per infraction")
        : unitLabels[rule.unit];

    return (
      <div className="whitespace-nowrap">
        <span className="font-medium">{formatEuros(rule.fineAmountCents)}</span>{" "}
        <span className="text-muted-foreground">{unitLabel}</span>
      </div>
    );
  },
});
