"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfileFinances } from "@/components/Profile/ProfileFinances";
import { ProfileVoting } from "@/components/Profile/ProfileVoting";
import { ProfileAccount } from "@/components/Profile/ProfileAccount";
import { ProfileActivity } from "@/components/Profile/ProfileActivity";
import {
  ProfileBalanceChart,
  ProfileBalanceChartSkeleton,
} from "@/components/Profile/ProfileBalanceChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />

        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <Skeleton className="h-9 w-24" />
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-2 h-4 w-48" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <ProfileHeaderSkeleton />

      <div className="grid gap-4 xl:grid-cols-4">
        <ProfileCardSkeleton />
        <ProfileCardSkeleton />
        <ProfileCardSkeleton />
        <ProfileCardSkeleton />
      </div>

      <ProfileBalanceChartSkeleton />
    </div>
  );
}

export function ProfileContent() {
  const profile = useQuery(api.profile.overview);

  if (profile === undefined) {
    return <ProfileSkeleton />;
  }

  if (profile === null) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  const account = {
    ...profile.account,
    username: profile.account.username ?? null,
    firstName: profile.account.firstName ?? null,
    lastName: profile.account.lastName ?? null,
    name: profile.account.name ?? null,
    color: profile.account.color ?? null,
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <ProfileHeader account={account} />

      <div className="grid gap-4 xl:grid-cols-4">
        <ProfileFinances finances={profile.finances} />

        <ProfileVoting voting={profile.voting} />

        <ProfileAccount account={account} />

        <ProfileActivity activity={profile.activity} />
      </div>

      <ProfileBalanceChart data={profile.chart} />
    </div>
  );
}
