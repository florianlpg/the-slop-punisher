import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_user_id", ["clerkUserId"]),

  infractionVotes: defineTable({
    infractionId: v.id("infractions"),
    voterUserId: v.string(),
    vote: v.union(
      v.literal("yes"),
      v.literal("no"),
    ),
    votedAt: v.number(),
  }).index(
    "by_infraction_and_voter",
    ["infractionId", "voterUserId"],
  ),

  transactions: defineTable({
    userId: v.string(),

    amountCents: v.number(),

    paymentMethod: v.literal("cash"),

    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("rejected"),
    ),

    createdBy: v.string(),
    createdAt: v.number(),

    requiredApprovals: v.number(),

    resolvedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  transactionVotes: defineTable({
    transactionId: v.id("transactions"),
    voterUserId: v.string(),
    vote: v.union(
      v.literal("yes"),
      v.literal("no"),
    ),
    votedAt: v.number(),
  }).index(
    "by_transaction_and_voter",
    ["transactionId", "voterUserId"],
  ),
  notifications: defineTable({
    type: v.union(
      v.literal("infraction_approval"),
      v.literal("system")
    ),
    infractionId: v.optional(v.id("infractions")),
    recipientUserId: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_recipient_and_read", ["recipientUserId", "read"]),

  rules: defineTable({
    description: v.string(),

    // Integer cents, EUR only.
    fineAmountCents: v.number(),

    unit: v.union(
      v.literal("occurrence"), // flat fine, one infraction = one fine
      v.literal("file"),
      v.literal("row"),
      v.literal("line"),
      v.literal("minute"),
      v.literal("custom")
    ),
    customUnitLabel: v.optional(v.string()),

    requiredApprovalsToConfirm: v.number(),

    status: v.union(
      v.literal("proposed"),
      v.literal("active"),
      v.literal("rejected"),
      v.literal("archived")
    ),

    createdBy: v.string(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  ruleVotes: defineTable({
    ruleId: v.id("rules"),
    voterUserId: v.string(),
    vote: v.union(v.literal("yes"), v.literal("no")),
    votedAt: v.number(),
  }).index("by_rule_and_voter", ["ruleId", "voterUserId"]),

  logs: defineTable({
    actorUserId: v.string(),

    action: v.union(
      v.literal("user_created"),

      v.literal("rule_created"),
      v.literal("rule_updated"),
      v.literal("rule_vote"),
      v.literal("rule_confirmed"),
      v.literal("rule_rejected"),

      v.literal("infraction_created"),
      v.literal("infraction_vote"),
      v.literal("infraction_confirmed"),
      v.literal("infraction_rejected"),

      v.literal("transaction_created"),
      v.literal("transaction_vote"),
      v.literal("transaction_confirmed"),
      v.literal("transaction_rejected"),

      v.literal("login"),
      v.literal("logout"),
    ),

    entityType: v.union(
      v.literal("user"),
      v.literal("rule"),
      v.literal("infraction"),
      v.literal("transaction"),
    ),

    entityId: v.optional(v.string()),

    targetUserId: v.optional(v.string()),

    metadata: v.optional(
      v.object({
        description: v.optional(v.string()),
        amountCents: v.optional(v.number()),
        quantity: v.optional(v.number()),
        vote: v.optional(
          v.union(
            v.literal("yes"),
            v.literal("no"),
          ),
        ),
        previousStatus: v.optional(v.string()),
        newStatus: v.optional(v.string()),
      }),
    ),

    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_actor", ["actorUserId"])
    .index(
      "by_entity",
      ["entityType", "entityId"],
    )
    .index("by_action", ["action"]),

  infractions: defineTable({
    ruleId: v.id("rules"),
    accusedUserId: v.string(),
    reportedBy: v.string(),
    quantity: v.number(),
    amountCents: v.number(),
    note: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_rule", ["ruleId"])
    .index("by_accused", ["accusedUserId"])
    .index("by_status", ["status"]),
})
