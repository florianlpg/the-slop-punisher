import { v } from "convex/values";

import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";

import { createLog } from "./logs";

async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity;
}

function getUserDisplayName(
  user: {
    firstName?: string;
    lastName?: string;
    name?: string;
    username?: string;
  } | null,
) {
  if (!user) {
    return "Unknown user";
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return fullName || user.name || user.username || "Unknown user";
}

/**
 * Create a cash transaction.
 *
 * Transactions are independent from infractions.
 * The transaction simply records cash received from a user.
 */
export const create = mutation({
  args: {
    userId: v.string(),

    amountCents: v.number(),
  },

  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);

    if (args.amountCents <= 0) {
      throw new Error("Transaction amount must be greater than zero");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.userId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const totalMembers = (await ctx.db.query("users").collect()).length;

    if (totalMembers <= 0) {
      throw new Error("There are no users available for approval");
    }

    const now = Date.now();

    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,

      amountCents: args.amountCents,

      paymentMethod: "cash",

      status: "pending",

      createdBy: identity.subject,

      createdAt: now,

      requiredApprovals: totalMembers,
    });

    await createLog(ctx, {
      actorUserId: identity.subject,

      action: "transaction_created",

      entityType: "transaction",

      entityId: transactionId,

      targetUserId: args.userId,

      metadata: {
        amountCents: args.amountCents,

        newStatus: "pending",
      },
    });

    return transactionId;
  },
});

/**
 * Return all transactions.
 */
export const list = query({
  args: {},

  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const transactions = await ctx.db
      .query("transactions")
      .order("desc")
      .collect();

    return await Promise.all(
      transactions.map(async (transaction) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_user_id", (q) =>
            q.eq("clerkUserId", transaction.userId),
          )
          .unique();

        const creator = await ctx.db
          .query("users")
          .withIndex("by_clerk_user_id", (q) =>
            q.eq("clerkUserId", transaction.createdBy),
          )
          .unique();

        const votes = await ctx.db
          .query("transactionVotes")
          .withIndex("by_transaction_and_voter", (q) =>
            q.eq("transactionId", transaction._id),
          )
          .collect();

        const yesVotes = votes.filter((vote) => vote.vote === "yes").length;

        const noVotes = votes.filter((vote) => vote.vote === "no").length;

        return {
          ...transaction,

          user,

          creator,

          userDisplayName: getUserDisplayName(user),

          creatorDisplayName: getUserDisplayName(creator),

          yesVotes,

          noVotes,

          currentUserVote:
            votes.find((vote) => vote.voterUserId === identity.subject)?.vote ??
            null,
        };
      }),
    );
  },
});

/**
 * Return pending transactions requiring approval.
 */
export const approvals = query({
  args: {},

  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();

    return await Promise.all(
      transactions.map(async (transaction) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_user_id", (q) =>
            q.eq("clerkUserId", transaction.userId),
          )
          .unique();

        const creator = await ctx.db
          .query("users")
          .withIndex("by_clerk_user_id", (q) =>
            q.eq("clerkUserId", transaction.createdBy),
          )
          .unique();

        const votes = await ctx.db
          .query("transactionVotes")
          .withIndex("by_transaction_and_voter", (q) =>
            q.eq("transactionId", transaction._id),
          )
          .collect();

        const yesVotes = votes.filter((vote) => vote.vote === "yes").length;

        const noVotes = votes.filter((vote) => vote.vote === "no").length;

        const currentUserVote =
          votes.find((vote) => vote.voterUserId === identity.subject)?.vote ??
          null;

        return {
          ...transaction,

          user,

          creator,

          userDisplayName: getUserDisplayName(user),

          creatorDisplayName: getUserDisplayName(creator),

          yesVotes,

          noVotes,

          currentUserVote,
        };
      }),
    );
  },
});

/**
 * Vote on a transaction.
 *
 * All users must approve a transaction for it to become confirmed.
 * A single rejection rejects the transaction.
 */
export const vote = mutation({
  args: {
    transactionId: v.id("transactions"),

    vote: v.union(v.literal("yes"), v.literal("no")),
  },

  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);

    const transaction = await ctx.db.get("transactions", args.transactionId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "pending") {
      throw new Error("This transaction is no longer pending");
    }

    const existingVote = await ctx.db
      .query("transactionVotes")
      .withIndex("by_transaction_and_voter", (q) =>
        q
          .eq("transactionId", args.transactionId)
          .eq("voterUserId", identity.subject),
      )
      .unique();

    if (existingVote) {
      await ctx.db.patch("transactionVotes", existingVote._id, {
        vote: args.vote,

        votedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("transactionVotes", {
        transactionId: args.transactionId,

        voterUserId: identity.subject,

        vote: args.vote,

        votedAt: Date.now(),
      });
    }

    await createLog(ctx, {
      actorUserId: identity.subject,

      action: "transaction_vote",

      entityType: "transaction",

      entityId: args.transactionId,

      targetUserId: transaction.userId,

      metadata: {
        vote: args.vote,
      },
    });

    const votes = await ctx.db
      .query("transactionVotes")
      .withIndex("by_transaction_and_voter", (q) =>
        q.eq("transactionId", args.transactionId),
      )
      .collect();

    const yesVotes = votes.filter((vote) => vote.vote === "yes").length;

    const noVotes = votes.filter((vote) => vote.vote === "no").length;

    if (noVotes > 0) {
      await ctx.db.patch("transactions", transaction._id, {
        status: "rejected",

        resolvedAt: Date.now(),
      });

      await createLog(ctx, {
        actorUserId: identity.subject,

        action: "transaction_rejected",

        entityType: "transaction",

        entityId: transaction._id,

        targetUserId: transaction.userId,

        metadata: {
          previousStatus: "pending",

          newStatus: "rejected",
        },
      });
    } else if (yesVotes >= transaction.requiredApprovals) {
      await ctx.db.patch("transactions", transaction._id, {
        status: "confirmed",

        resolvedAt: Date.now(),
      });

      await createLog(ctx, {
        actorUserId: identity.subject,

        action: "transaction_confirmed",

        entityType: "transaction",

        entityId: transaction._id,

        targetUserId: transaction.userId,

        metadata: {
          previousStatus: "pending",

          newStatus: "confirmed",
        },
      });
    }

    return {
      yesVotes,
      noVotes,
    };
  },
});
