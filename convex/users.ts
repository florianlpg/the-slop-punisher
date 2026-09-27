import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server"

async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error("Not authenticated")
  }

  return identity
}

export const ensureUser = mutation({
  args: {},

  handler: async (ctx) => {
    const identity = await requireIdentity(ctx)

    console.log("FULL CLERK IDENTITY:", identity)

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject),
      )
      .unique()

    const userData = {
      username:
        identity.preferredUsername ??
        identity.nickname ??
        undefined,

      firstName: identity.givenName ?? undefined,
      lastName: identity.familyName ?? undefined,
      name: identity.name ?? undefined,
      updatedAt: Date.now(),
    }

    if (existing) {
      await ctx.db.patch("users", existing._id, userData)

      return existing._id
    }

    return await ctx.db.insert("users", {
      clerkUserId: identity.subject,
      ...userData,
      createdAt: Date.now(),
    })
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireIdentity(ctx)

    return await ctx.db
      .query("users")
      .order("asc")
      .collect()
  },
})

export const count = query({
  args: {},
  handler: async (ctx) => {
    await requireIdentity(ctx)

    return (await ctx.db.query("users").collect()).length
  },
})
