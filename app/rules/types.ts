import { type Id } from "@/convex/_generated/dataModel"

export type RuleUnit = "occurrence" | "file" | "row" | "line" | "minute" | "custom"
export type RuleStatus = "proposed" | "active" | "rejected" | "archived"

export type RuleTableRow = {
  _id: Id<"rules">
  description: string
  fineAmountCents: number
  unit: RuleUnit
  customUnitLabel?: string
  requiredApprovalsToConfirm: number
  status: RuleStatus
  yesVotes: number
  totalVotes: number
  myVote: "yes" | "no" | null
  totalMembers: number // merged in from Clerk, not part of the Convex doc
}
