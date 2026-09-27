import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server"

const USER_COLORS = [
  "#2563EB", // blue
  "#DC2626", // red
  "#16A34A", // green
  "#9333EA", // purple
  "#EA580C", // orange
  "#0891B2", // cyan
  "#DB2777", // pink
  "#65A30D", // lime
  "#7C3AED", // violet
  "#0F766E", // teal
  "#CA8A04", // yellow
  "#C2410C", // deep orange
] as const

async function requireIdentity(
  ctx: QueryCtx | MutationCtx,
) {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error("Not authenticated")
  }

  return identity
}

async function getAvailableUserColor(
  ctx: MutationCtx,
) {
  const users = await ctx.db
    .query("users")
    .collect()

  const usedColors = new Set(
    users
      .map((user) => user.color)
      .filter(
        (color): color is string =>
          color !== undefined,
      ),
  )

  const availableColor = USER_COLORS.find(
    (color) => !usedColors.has(color),
  )

  if (availableColor) {
    return availableColor
  }

  // Fallback for groups larger than the predefined palette.
  // Uses the golden angle to distribute additional
  // colors around the hue wheel.
  const hue =
    (users.length * 137.508) % 360

  return `hsl(${hue.toFixed(1)} 70% 50%)`
}

export const ensureUser = mutation({
  args: {},

  handler: async (ctx) => {
    const identity = await requireIdentity(ctx)

    const existing = await ctx.db
      .query("users")
      .withIndex(
        "by_clerk_user_id",
        (q) =>
          q.eq(
            "clerkUserId",
            identity.subject,
          ),
      )
      .unique()

    const now = Date.now()

    const userData = {
      username:
        identity.preferredUsername ??
        identity.nickname ??
        undefined,

      firstName:
        identity.givenName ??
        undefined,

      lastName:
        identity.familyName ??
        undefined,

      name:
        identity.name ??
        undefined,

      updatedAt: now,
    }

    if (existing) {
      if (!existing.color) {
        const color =
          await getAvailableUserColor(ctx)

        await ctx.db.patch(
          "users",
          existing._id,
          {
            ...userData,
            color,
          },
        )
      } else {
        await ctx.db.patch(
          "users",
          existing._id,
          userData,
        )
      }

      return existing._id
    }

    const color =
      await getAvailableUserColor(ctx)

    return await ctx.db.insert("users", {
      clerkUserId: identity.subject,
      ...userData,
      color,
      createdAt: now,
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

    return (
      await ctx.db
        .query("users")
        .collect()
    ).length
  },
})
