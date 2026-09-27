import { v } from "convex/values"

import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server"

import { createLog } from "./logs"

async function requireIdentity(
  ctx: QueryCtx | MutationCtx,
) {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error("Not authenticated")
  }

  return identity
}

export const active = query({
  args: {},

  handler: async (ctx) => {
    await requireIdentity(ctx)

    return await ctx.db
      .query("rules")
      .withIndex("by_status", (q) =>
        q.eq("status", "active"),
      )
      .order("desc")
      .collect()
  },
})

export const list = query({
  args: {},

  handler: async (ctx) => {
    const identity = await requireIdentity(ctx)

    const rules = await ctx.db
      .query("rules")
      .order("desc")
      .collect()

    return Promise.all(
      rules.map(async (rule) => {
        const votes = await ctx.db
          .query("ruleVotes")
          .withIndex(
            "by_rule_and_voter",
            (q) =>
              q.eq(
                "ruleId",
                rule._id,
              ),
          )
          .collect()

        const yesVotes =
          votes.filter(
            (vote) =>
              vote.vote === "yes",
          ).length

        const myVote =
          votes.find(
            (vote) =>
              vote.voterUserId ===
              identity.subject,
          )?.vote ?? null

        return {
          ...rule,
          yesVotes,
          totalVotes: votes.length,
          myVote,
        }
      }),
    )
  },
})

export const create = mutation({
  args: {
    description: v.string(),

    fineAmountCents: v.number(),

    unit: v.union(
      v.literal("occurrence"),
      v.literal("file"),
      v.literal("row"),
      v.literal("line"),
      v.literal("minute"),
      v.literal("custom"),
    ),

    customUnitLabel:
      v.optional(v.string()),

    requiredApprovalsToConfirm:
      v.number(),
  },

  handler: async (ctx, args) => {
    const identity =
      await requireIdentity(ctx)

    const ruleId =
      await ctx.db.insert("rules", {
        description:
          args.description,

        fineAmountCents:
          args.fineAmountCents,

        unit: args.unit,

        customUnitLabel:
          args.customUnitLabel,

        requiredApprovalsToConfirm:
          args.requiredApprovalsToConfirm,

        status: "proposed",

        createdBy:
          identity.subject,

        createdAt:
          Date.now(),
      })

    await createLog(ctx, {
      actorUserId:
        identity.subject,

      action:
        "rule_created",

      entityType:
        "rule",

      entityId:
        ruleId,

      metadata: {
        description:
          args.description,

        amountCents:
          args.fineAmountCents,
      },
    })

    return ruleId
  },
})

export const archive = mutation({
  args: {
    ruleId: v.id("rules"),
  },

  handler: async (ctx, args) => {
    const identity =
      await requireIdentity(ctx)

    const rule =
      await ctx.db.get(
        "rules",
        args.ruleId,
      )

    if (!rule) {
      throw new Error(
        "Rule not found",
      )
    }

    await ctx.db.patch(
      "rules",
      args.ruleId,
      {
        status: "archived",
      },
    )

    await createLog(ctx, {
      actorUserId:
        identity.subject,

      action:
        "rule_updated",

      entityType:
        "rule",

      entityId:
        args.ruleId,

      metadata: {
        previousStatus:
          rule.status,

        newStatus:
          "archived",
      },
    })
  },
})

export const vote = mutation({
  args: {
    ruleId: v.id("rules"),

    vote: v.union(
      v.literal("yes"),
      v.literal("no"),
    ),

    totalMembers:
      v.number(),
  },

  handler: async (ctx, args) => {
    const identity =
      await requireIdentity(ctx)

    const rule =
      await ctx.db.get(
        "rules",
        args.ruleId,
      )

    if (!rule) {
      throw new Error(
        "Rule not found",
      )
    }

    if (
      rule.status !==
      "proposed"
    ) {
      throw new Error(
        "This rule is no longer open for voting",
      )
    }

    const existing =
      await ctx.db
        .query("ruleVotes")
        .withIndex(
          "by_rule_and_voter",
          (q) =>
            q
              .eq(
                "ruleId",
                args.ruleId,
              )
              .eq(
                "voterUserId",
                identity.subject,
              ),
        )
        .unique()

    if (existing) {
      await ctx.db.patch(
        "ruleVotes",
        existing._id,
        {
          vote: args.vote,
          votedAt:
            Date.now(),
        },
      )
    } else {
      await ctx.db.insert(
        "ruleVotes",
        {
          ruleId:
            args.ruleId,

          voterUserId:
            identity.subject,

          vote: args.vote,

          votedAt:
            Date.now(),
        },
      )
    }

    await createLog(ctx, {
      actorUserId:
        identity.subject,

      action:
        "rule_vote",

      entityType:
        "rule",

      entityId:
        args.ruleId,

      metadata: {
        vote:
          args.vote,
      },
    })

    const votes =
      await ctx.db
        .query("ruleVotes")
        .withIndex(
          "by_rule_and_voter",
          (q) =>
            q.eq(
              "ruleId",
              args.ruleId,
            ),
        )
        .collect()

    const yesVotes =
      votes.filter(
        (vote) =>
          vote.vote === "yes",
      ).length

    if (
      yesVotes >=
      args.totalMembers
    ) {
      await ctx.db.patch(
        "rules",
        args.ruleId,
        {
          status: "active",
        },
      )

      await createLog(ctx, {
        actorUserId:
          identity.subject,

        action:
          "rule_confirmed",

        entityType:
          "rule",

        entityId:
          args.ruleId,

        metadata: {
          previousStatus:
            "proposed",

          newStatus:
            "active",
        },
      })
    }
  },
})
