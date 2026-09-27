import { v } from "convex/values"
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server"

async function requireIdentity(
  ctx: QueryCtx | MutationCtx,
) {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error("Not authenticated")
  }

  return identity
}

function getUserDisplayName(
  user:
    | {
        firstName?: string
        lastName?: string
        name?: string
        username?: string
      }
    | null,
) {
  if (!user) {
    return "Unknown user"
  }

  const fullName = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    fullName ||
    user.name ||
    user.username ||
    "Unknown user"
  )
}

/**
 * Create a new infraction.
 *
 * Infractions requiring more than one approval are
 * created as pending. Otherwise they are immediately
 * confirmed.
 */
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
      throw new Error(
        "Quantity must be greater than zero",
      )
    }

    const rule = await ctx.db.get(
      "rules",
      args.ruleId,
    )

    if (!rule) {
      throw new Error("Rule not found")
    }

    if (rule.status !== "active") {
      throw new Error(
        "This rule is not active",
      )
    }

    const accusedUser = await ctx.db
      .query("users")
      .withIndex(
        "by_clerk_user_id",
        (q) =>
          q.eq(
            "clerkUserId",
            args.accusedUserId,
          ),
      )
      .unique()

    if (!accusedUser) {
      throw new Error(
        "Accused user not found",
      )
    }

    const amountCents =
      rule.fineAmountCents * args.quantity

    const status =
      rule.requiredApprovalsToConfirm <= 1
        ? "confirmed"
        : "pending"

    const now = Date.now()

    return await ctx.db.insert(
      "infractions",
      {
        ruleId: args.ruleId,
        accusedUserId: args.accusedUserId,
        reportedBy: identity.subject,
        quantity: args.quantity,
        amountCents,
        note: args.note,
        status,
        createdAt: now,
        ...(status === "confirmed"
          ? {
              resolvedAt: now,
            }
          : {}),
      },
    )
  },
})

/**
 * Return all pending infractions that require approval.
 */
export const approvals = query({
  args: {},

  handler: async (ctx) => {
    const identity = await requireIdentity(ctx)

    const infractions = await ctx.db
      .query("infractions")
      .withIndex("by_status", (q) =>
        q.eq("status", "pending"),
      )
      .order("desc")
      .collect()

    return await Promise.all(
      infractions.map(async (infraction) => {
        const rule = await ctx.db.get(
          "rules",
          infraction.ruleId,
        )

        const accusedUser = await ctx.db
          .query("users")
          .withIndex(
            "by_clerk_user_id",
            (q) =>
              q.eq(
                "clerkUserId",
                infraction.accusedUserId,
              ),
          )
          .unique()

        const reporterUser = await ctx.db
          .query("users")
          .withIndex(
            "by_clerk_user_id",
            (q) =>
              q.eq(
                "clerkUserId",
                infraction.reportedBy,
              ),
          )
          .unique()

        const votes = await ctx.db
          .query("infractionVotes")
          .withIndex(
            "by_infraction_and_voter",
            (q) =>
              q.eq(
                "infractionId",
                infraction._id,
              ),
          )
          .collect()

        const yesVotes = votes.filter(
          (vote) => vote.vote === "yes",
        ).length

        const noVotes = votes.filter(
          (vote) => vote.vote === "no",
        ).length

        const currentUserVote =
          votes.find(
            (vote) =>
              vote.voterUserId ===
              identity.subject,
          )?.vote ?? null

        return {
          ...infraction,

          rule,

          accusedUser,

          reporterUser,

          yesVotes,

          noVotes,

          requiredApprovals:
            rule?.requiredApprovalsToConfirm ??
            1,

          currentUserVote,
        }
      }),
    )
  },
})

/**
 * Vote on a pending infraction.
 */
export const vote = mutation({
  args: {
    infractionId: v.id("infractions"),
    vote: v.union(
      v.literal("yes"),
      v.literal("no"),
    ),
  },

  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx)

    const infraction = await ctx.db.get(
      "infractions",
      args.infractionId,
    )

    if (!infraction) {
      throw new Error(
        "Infraction not found",
      )
    }

    if (infraction.status !== "pending") {
      throw new Error(
        "This infraction is no longer pending",
      )
    }

    const existingVote = await ctx.db
      .query("infractionVotes")
      .withIndex(
        "by_infraction_and_voter",
        (q) =>
          q
            .eq(
              "infractionId",
              args.infractionId,
            )
            .eq(
              "voterUserId",
              identity.subject,
            ),
      )
      .unique()

    if (existingVote) {
      await ctx.db.patch(
        "infractionVotes",
        existingVote._id,
        {
          vote: args.vote,
          votedAt: Date.now(),
        },
      )
    } else {
      await ctx.db.insert(
        "infractionVotes",
        {
          infractionId:
            args.infractionId,
          voterUserId:
            identity.subject,
          vote: args.vote,
          votedAt: Date.now(),
        },
      )
    }

    const votes = await ctx.db
      .query("infractionVotes")
      .withIndex(
        "by_infraction_and_voter",
        (q) =>
          q.eq(
            "infractionId",
            args.infractionId,
          ),
      )
      .collect()

    const yesVotes = votes.filter(
      (vote) => vote.vote === "yes",
    ).length

    const noVotes = votes.filter(
      (vote) => vote.vote === "no",
    ).length

    const rule = await ctx.db.get(
      "rules",
      infraction.ruleId,
    )

    if (!rule) {
      throw new Error("Rule not found")
    }

    if (
      yesVotes >=
      rule.requiredApprovalsToConfirm
    ) {
      await ctx.db.patch(
        "infractions",
        infraction._id,
        {
          status: "confirmed",
          resolvedAt: Date.now(),
        },
      )
    } else if (
      noVotes >=
      rule.requiredApprovalsToConfirm
    ) {
      await ctx.db.patch(
        "infractions",
        infraction._id,
        {
          status: "rejected",
          resolvedAt: Date.now(),
        },
      )
    }

    return {
      yesVotes,
      noVotes,
    }
  },
})
