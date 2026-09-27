import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileFinancesProps = {
  finances: {
    totalPenaltiesCents: number;
    totalPaidCents: number;
    balanceCents: number;
    confirmedInfractions: number;
    confirmedTransactions: number;
    pendingTransactions: number;
  };
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function ProfileFinances({ finances }: ProfileFinancesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="size-4" />
          Finances
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">Current balance</p>

          <p className="mt-1 text-3xl font-semibold">
            {formatCurrency(finances.balanceCents)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {finances.balanceCents > 0
              ? "Amount still owed"
              : finances.balanceCents < 0
                ? "Credit balance"
                : "All settled"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <ArrowUpRight className="mb-2 size-4 text-muted-foreground" />

            <p className="text-xs text-muted-foreground">Penalties</p>

            <p className="mt-1 font-semibold">
              {formatCurrency(finances.totalPenaltiesCents)}
            </p>
          </div>

          <div className="rounded-lg border p-3">
            <ArrowDownLeft className="mb-2 size-4 text-muted-foreground" />

            <p className="text-xs text-muted-foreground">Paid</p>

            <p className="mt-1 font-semibold">
              {formatCurrency(finances.totalPaidCents)}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Confirmed penalties</span>

            <span>{finances.confirmedInfractions}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Payments</span>

            <span>{finances.confirmedTransactions}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Pending payments</span>

            <span>{finances.pendingTransactions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
