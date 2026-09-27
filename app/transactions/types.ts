import type { Id } from "@/convex/_generated/dataModel"

export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "rejected"

export type TransactionVote =
  | "yes"
  | "no"
  | null

export type TransactionTableRow = {
  _id: Id<"transactions">

  userId: string
  createdBy: string

  amountCents: number
  paymentMethod: "cash"

  status: TransactionStatus

  createdAt: number
  resolvedAt?: number

  requiredApprovals: number

  userDisplayName: string
  creatorDisplayName: string

  yesVotes: number
  noVotes: number

  currentUserVote: TransactionVote
}
