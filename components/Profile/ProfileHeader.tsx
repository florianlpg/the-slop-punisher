"use client";

import { useUser } from "@clerk/nextjs";
import { CalendarDays } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type ProfileAccount = {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  color: string | null;
  createdAt: number;
};

type ProfileHeaderProps = {
  account: ProfileAccount;
};

export function ProfileHeader({ account }: ProfileHeaderProps) {
  const { user } = useUser();

  const displayName = account.name ?? account.username ?? "User";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar className="size-20">
          <AvatarImage src={user?.imageUrl} alt={displayName} />

          <AvatarFallback
            style={{
              backgroundColor: account.color ?? undefined,
            }}
            className="text-xl font-semibold text-white"
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {displayName}
          </h1>

          {account.username && (
            <p className="text-muted-foreground">@{account.username}</p>
          )}

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />

            <span>
              Member since{" "}
              {new Date(account.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
