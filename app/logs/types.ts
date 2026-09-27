import type { Id } from "@/convex/_generated/dataModel"

export type LogAction =
  | "user_created"
  | "rule_created"
  | "rule_updated"
  | "rule_vote"
  | "rule_confirmed"
  | "rule_rejected"
  | "infraction_created"
  | "infraction_vote"
  | "infraction_confirmed"
  | "infraction_rejected"
  | "transaction_created"
  | "transaction_vote"
  | "transaction_confirmed"
  | "transaction_rejected"
  | "login"
  | "logout"

export type LogEntityType =
  | "user"
  | "rule"
  | "infraction"
  | "transaction"

export type LogVote = "yes" | "no"

export type LogMetadata = {
  description?: string
  amountCents?: number
  quantity?: number
  vote?: LogVote
  previousStatus?: string
  newStatus?: string
}

export type LogUser = {
  _id: Id<"users">
  clerkUserId: string
  username?: string
  firstName?: string
  lastName?: string
  name?: string
}

export type LogTableRow = {
  _id: Id<"logs">
  actorUserId: string
  action: LogAction
  entityType: LogEntityType
  entityId?: string
  targetUserId?: string
  metadata?: LogMetadata
  createdAt: number
  actor: LogUser | null
  targetUser: LogUser | null
}
