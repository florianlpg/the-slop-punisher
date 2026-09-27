import { Activity, FileWarning, Gavel, Receipt } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileActivityProps = {
  activity: {
    infractionsReceived: number;
    infractionsReported: number;
    transactionsCreated: number;
    rulesCreated: number;
  };
};

export function ProfileActivity({ activity }: ProfileActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-4" />
          Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <FileWarning className="size-4 text-muted-foreground" />

            <span className="text-sm">Infractions received</span>
          </div>

          <span className="font-semibold">{activity.infractionsReceived}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <FileWarning className="size-4 text-muted-foreground" />

            <span className="text-sm">Infractions reported</span>
          </div>

          <span className="font-semibold">{activity.infractionsReported}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <Receipt className="size-4 text-muted-foreground" />

            <span className="text-sm">Transactions created</span>
          </div>

          <span className="font-semibold">{activity.transactionsCreated}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <Gavel className="size-4 text-muted-foreground" />

            <span className="text-sm">Rules proposed</span>
          </div>

          <span className="font-semibold">{activity.rulesCreated}</span>
        </div>
      </CardContent>
    </Card>
  );
}
