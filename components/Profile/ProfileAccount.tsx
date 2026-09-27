import { ShieldCheck, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileAccountProps = {
  account: {
    clerkUserId: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    name: string | null;
    createdAt: number;
  };
};

export function ProfileAccount({ account }: ProfileAccountProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="size-4" />
          Account
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">Username</p>
          <p className="mt-1 font-medium">
            {account.username ? `@${account.username}` : "Not set"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Full name</p>
          <p className="mt-1 font-medium">{account.name ?? "Not set"}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">First name</p>
          <p className="mt-1 font-medium">{account.firstName ?? "Not set"}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Last name</p>
          <p className="mt-1 font-medium">{account.lastName ?? "Not set"}</p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border p-3">
          <ShieldCheck className="size-4" />

          <div>
            <p className="text-sm font-medium">Clerk authenticated</p>
            <p className="text-xs text-muted-foreground">
              Your account is securely authenticated.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
