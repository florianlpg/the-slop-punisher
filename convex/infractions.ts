import { v } from "convex/values"
import {
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server"

async function requireIdentity(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error("Not authenticated")
  }

  return identity
}

export const create = mutation({
  args: {
    ruleId: v.id("rules"),
    accusedUserId: v.string(),
    quantity: v.number(),
    note: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx)

    if (args.quantity <= 0) {
      throw new Error("Quantity must be greater than zero")
    }

    const rule = await ctx.db.get("rules", args.ruleId)

    if (!rule) {
      throw new Error("Rule not found")
    }

    if (rule.status !== "active") {
      throw new Error("This rule is not active")
    }

    const amountCents =
      rule.fineAmountCents * args.quantity

    const status =
      rule.requiredApprovalsToConfirm > 1
        ? "pending"
        : "confirmed"

    const infractionId = await ctx.db.insert("infractions", {
      ruleId: args.ruleId,
      accusedUserId: args.accusedUserId,
      reportedBy: identity.subject,
      quantity: args.quantity,
      amountCents,
      note: args.note,
      status,
      createdAt: Date.now(),
      resolvedAt:
        status === "confirmed"
          ? Date.now()
          : undefined,
    })

    return {
      infractionId,
      status,
    }
  },
})
