import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    createdAt: v.number(),
  }).index("by_clerk_user_id", ["clerkUserId"]),

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

  infractions: defineTable({
    ruleId: v.id("rules"),
    accusedUserId: v.string(),
    reportedBy: v.string(),
    quantity: v.number(),
    amountCents: v.number(), // snapshotted fineAmountCents * quantity, EUR
    note: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("rejected")
    ),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_rule", ["ruleId"])
    .index("by_accused", ["accusedUserId"])
    .index("by_status", ["status"]),

  infractionVotes: defineTable({
    infractionId: v.id("infractions"),
    voterUserId: v.string(),
    vote: v.union(v.literal("yes"), v.literal("no")),
    votedAt: v.number(),
  }).index("by_infraction_and_voter", [
    "infractionId",
    "voterUserId",
  ]),
})
