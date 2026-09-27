import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { query, type MutationCtx, type QueryCtx } from "./_generated/server";

async function requireIdentity(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity;
}

type LogAction =
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
  | "logout";

type LogEntityType = "user" | "rule" | "infraction" | "transaction";

type LogMetadata = {
  description?: string;
  amountCents?: number;
  quantity?: number;
  vote?: "yes" | "no";
  previousStatus?: string;
  newStatus?: string;
};

type CreateLogArgs = {
  actorUserId: string;
  action: LogAction;
  entityType: LogEntityType;
  entityId?: string;
  targetUserId?: string;
  metadata?: LogMetadata;
};

export async function createLog(ctx: MutationCtx, args: CreateLogArgs) {
  return await ctx.db.insert("logs", {
    actorUserId: args.actorUserId,
    action: args.action,
    entityType: args.entityType,
    entityId: args.entityId,
    targetUserId: args.targetUserId,
    metadata: args.metadata,
    createdAt: Date.now(),
  });
}

const logAction = v.union(
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
);

const logEntityType = v.union(
  v.literal("user"),
  v.literal("rule"),
  v.literal("infraction"),
  v.literal("transaction"),
);

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, args) => {
    await requireIdentity(ctx);

    const logs = await ctx.db
      .query("logs")
      .withIndex("by_created_at")
      .order("desc")
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      logs.page.map(async (log) => {
        const actor = await ctx.db
          .query("users")
          .withIndex("by_clerk_user_id", (q) =>
            q.eq("clerkUserId", log.actorUserId),
          )
          .unique();

        const targetUser = log.targetUserId
          ? await ctx.db
              .query("users")
              .withIndex("by_clerk_user_id", (q) =>
                q.eq("clerkUserId", log.targetUserId!),
              )
              .unique()
          : null;

        return {
          ...log,

          actor: actor
            ? {
                _id: actor._id,
                clerkUserId: actor.clerkUserId,
                username: actor.username,
                firstName: actor.firstName,
                lastName: actor.lastName,
                name: actor.name,
              }
            : null,

          targetUser: targetUser
            ? {
                _id: targetUser._id,
                clerkUserId: targetUser.clerkUserId,
                username: targetUser.username,
                firstName: targetUser.firstName,
                lastName: targetUser.lastName,
                name: targetUser.name,
              }
            : null,
        };
      }),
    );

    return {
      ...logs,
      page,
    };
  },
});

export const byEntity = query({
  args: {
    entityType: logEntityType,
    entityId: v.string(),
  },

  handler: async (ctx, args) => {
    await requireIdentity(ctx);

    const logs = await ctx.db
      .query("logs")
      .withIndex("by_entity", (q) =>
        q.eq("entityType", args.entityType).eq("entityId", args.entityId),
      )
      .order("desc")
      .collect();

    return await Promise.all(
      logs.map(async (log) => {
        const actor = await ctx.db
          .query("users")
          .withIndex("by_clerk_user_id", (q) =>
            q.eq("clerkUserId", log.actorUserId),
          )
          .unique();

        const targetUser = log.targetUserId
          ? await ctx.db
              .query("users")
              .withIndex("by_clerk_user_id", (q) =>
                q.eq("clerkUserId", log.targetUserId!),
              )
              .unique()
          : null;

        return {
          ...log,
          actor,
          targetUser,
        };
      }),
    );
  },
});

export const byAction = query({
  args: {
    action: logAction,
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, args) => {
    await requireIdentity(ctx);

    return await ctx.db
      .query("logs")
      .withIndex("by_action", (q) => q.eq("action", args.action))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const byActor = query({
  args: {
    actorUserId: v.string(),
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, args) => {
    await requireIdentity(ctx);

    return await ctx.db
      .query("logs")
      .withIndex("by_actor", (q) => q.eq("actorUserId", args.actorUserId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
