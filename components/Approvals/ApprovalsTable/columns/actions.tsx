"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { ApprobationTableRow } from "@/app/approbations/types";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { columnHelper } from "./helper";

function ActionsCell({ infraction }: { infraction: ApprobationTableRow }) {
  const vote = useMutation(api.infractions.vote);

  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (value: "yes" | "no") => {
    if (isVoting) {
      return;
    }

    setIsVoting(true);

    try {
      await vote({
        infractionId: infraction._id,
        vote: value,
      });
    } catch (error) {
      console.error("Failed to vote on infraction:", error);
    } finally {
      setIsVoting(false);
    }
  };

  if (infraction.currentUserVote) {
    return (
      <span className="text-sm text-muted-foreground">
        You voted {infraction.currentUserVote === "yes" ? "Approve" : "Reject"}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={isVoting}
        onClick={() => handleVote("no")}
      >
        <XIcon />
        Reject
      </Button>

      <Button size="sm" disabled={isVoting} onClick={() => handleVote("yes")}>
        <CheckIcon />
        Approve
      </Button>
    </div>
  );
}

export const actionsColumn = columnHelper.display({
  id: "actions",
  header: "",
  cell: ({ row }) => (
    <div className="flex justify-end">
      <ActionsCell infraction={row.original} />
    </div>
  ),
});
