import { mutation, query } from "./_generated/server"

export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject)
      )
      .unique()

    if (existing) {
      return existing._id
    }

    return await ctx.db.insert("users", {
      clerkUserId: identity.subject,
      createdAt: Date.now(),
    })
  },
})

export const count = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    return (await ctx.db.query("users").collect()).length
  },
})
