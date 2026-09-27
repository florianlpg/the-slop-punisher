import { CheckCircle2, Vote } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileVotingProps = {
  voting: {
    totalVotes: number;
    yesVotes: number;
    noVotes: number;
    infractionVotes: number;
    transactionVotes: number;
    ruleVotes: number;
  };
};

export function ProfileVoting({ voting }: ProfileVotingProps) {
  const yesPercentage =
    voting.totalVotes > 0
      ? Math.round((voting.yesVotes / voting.totalVotes) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="size-4" />
          Participation
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">Total votes</p>

          <p className="mt-1 text-3xl font-semibold">{voting.totalVotes}</p>
        </div>

        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4" />
              Yes votes
            </span>

            <span className="font-semibold">{voting.yesVotes}</span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${yesPercentage}%`,
              }}
            />
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {yesPercentage}% of all votes
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Infractions</span>
            <span>{voting.infractionVotes}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Transactions</span>
            <span>{voting.transactionVotes}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Rules</span>
            <span>{voting.ruleVotes}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">No votes</span>
            <span>{voting.noVotes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
