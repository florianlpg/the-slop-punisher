"use client"

import { useMutation } from "convex/react"
import { Check } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { type RuleTableRow } from "@/app/rules/types"
import { columnHelper } from "./helper"

function VoteCell({ rule }: { rule: RuleTableRow }) {
  const castVote = useMutation(api.rules.vote)
  const hasVotedYes = rule.myVote === "yes"

  return (
    <div className="flex items-center gap-2">
      <Badge variant={rule.status === "active" ? "default" : "secondary"}>
        {rule.status === "active" ? "Active" : "Proposed"}
      </Badge>
      <span className="tabular-nums text-sm">
        {rule.yesVotes} / {rule.totalMembers}
      </span>
      {rule.status === "proposed" && (
        <Button
          size="sm"
          variant={hasVotedYes ? "secondary" : "outline"}
          className="h-7"
          disabled={hasVotedYes}
          onClick={() =>
            castVote({ ruleId: rule._id, vote: "yes", totalMembers: rule.totalMembers })
          }
        >
          <Check className="h-3.5 w-3.5" />
          {hasVotedYes ? "Voted" : "Vote yes"}
        </Button>
      )}
    </div>
  )
}

export const votesColumn = columnHelper.accessor((row) => row.yesVotes, {
  id: "votes",
  header: "Votes",
  cell: ({ row }) => <VoteCell rule={row.original} />,
})
