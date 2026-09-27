import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";

async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity;
}

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject),
      )
      .unique();

    if (!user) {
      return null;
    }

    const [
      allInfractions,
      allTransactions,
      allInfractionVotes,
      allTransactionVotes,
      allRuleVotes,
      allRules,
      recentLogs,
    ] = await Promise.all([
      ctx.db.query("infractions").collect(),
      ctx.db.query("transactions").collect(),
      ctx.db.query("infractionVotes").collect(),
      ctx.db.query("transactionVotes").collect(),
      ctx.db.query("ruleVotes").collect(),
      ctx.db.query("rules").collect(),
      ctx.db
        .query("logs")
        .withIndex("by_actor", (q) => q.eq("actorUserId", identity.subject))
        .order("desc")
        .take(10),
    ]);

    const userInfractions = allInfractions.filter(
      (infraction) => infraction.accusedUserId === identity.subject,
    );

    const userReportedInfractions = allInfractions.filter(
      (infraction) => infraction.reportedBy === identity.subject,
    );

    const userTransactions = allTransactions.filter(
      (transaction) => transaction.userId === identity.subject,
    );

    const userInfractionVotes = allInfractionVotes.filter(
      (vote) => vote.voterUserId === identity.subject,
    );

    const userTransactionVotes = allTransactionVotes.filter(
      (vote) => vote.voterUserId === identity.subject,
    );

    const userRuleVotes = allRuleVotes.filter(
      (vote) => vote.voterUserId === identity.subject,
    );

    const userRules = allRules.filter(
      (rule) => rule.createdBy === identity.subject,
    );

    const confirmedInfractions = userInfractions.filter(
      (infraction) => infraction.status === "confirmed",
    );

    const confirmedTransactions = userTransactions.filter(
      (transaction) => transaction.status === "confirmed",
    );

    const totalPenaltiesCents = confirmedInfractions.reduce(
      (total, infraction) => total + infraction.amountCents,
      0,
    );

    const totalPaidCents = confirmedTransactions.reduce(
      (total, transaction) => total + transaction.amountCents,
      0,
    );

    const balanceCents = totalPenaltiesCents - totalPaidCents;

    const allVotes = [
      ...userInfractionVotes,
      ...userTransactionVotes,
      ...userRuleVotes,
    ];

    const yesVotes = allVotes.filter((vote) => vote.vote === "yes").length;

    const noVotes = allVotes.filter((vote) => vote.vote === "no").length;

    /*
     * Keep the chart history identical to the dashboard.
     *
     * startingBalanceCents represents the user's balance
     * immediately before the beginning of the 366-day chart
     * history.
     */
    const now = Date.now();

    const chartHistoryStart = now - 366 * 24 * 60 * 60 * 1000;

    const chartInfractions = confirmedInfractions.filter(
      (infraction) => infraction.createdAt >= chartHistoryStart,
    );

    const chartTransactions = confirmedTransactions.filter(
      (transaction) => transaction.createdAt >= chartHistoryStart,
    );

    let startingBalanceCents = 0;

    for (const infraction of confirmedInfractions) {
      if (infraction.createdAt < chartHistoryStart) {
        startingBalanceCents += infraction.amountCents;
      }
    }

    for (const transaction of confirmedTransactions) {
      if (transaction.createdAt < chartHistoryStart) {
        startingBalanceCents -= transaction.amountCents;
      }
    }

    return {
      account: {
        clerkUserId: user.clerkUserId,
        username:
          user.username ??
          identity.preferredUsername ??
          identity.nickname ??
          undefined,
        firstName: user.firstName ?? identity.givenName ?? undefined,
        lastName: user.lastName ?? identity.familyName ?? undefined,
        name: user.name ?? identity.name ?? undefined,
        color: user.color,
        createdAt: user.createdAt,
      },

      finances: {
        totalPenaltiesCents,
        totalPaidCents,
        balanceCents,
        confirmedInfractions: confirmedInfractions.length,
        confirmedTransactions: confirmedTransactions.length,
        pendingTransactions: userTransactions.filter(
          (transaction) => transaction.status === "pending",
        ).length,
      },

      voting: {
        totalVotes: yesVotes + noVotes,
        yesVotes,
        noVotes,
        infractionVotes: userInfractionVotes.length,
        transactionVotes: userTransactionVotes.length,
        ruleVotes: userRuleVotes.length,
      },

      activity: {
        infractionsReceived: userInfractions.length,
        infractionsReported: userReportedInfractions.length,
        transactionsCreated: userTransactions.length,
        rulesCreated: userRules.length,
      },

      recentActivity: recentLogs,

      chart: {
        users: [
          {
            id: identity.subject,
            name: user.name ?? user.username ?? "You",
            color: user.color ?? "var(--chart-1)",
          },
        ],

        infractions: chartInfractions.map((infraction) => ({
          userId: identity.subject,
          amountCents: infraction.amountCents,
          createdAt: infraction.createdAt,
        })),

        transactions: chartTransactions.map((transaction) => ({
          userId: identity.subject,
          amountCents: transaction.amountCents,
          createdAt: transaction.createdAt,
        })),

        startingBalances: {
          [identity.subject]: startingBalanceCents,
        },
      },
    };
  },
});

export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject),
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    const now = Date.now();

    return await ctx.db.insert("users", {
      clerkUserId: identity.subject,
      username: identity.preferredUsername ?? identity.nickname ?? undefined,
      firstName: identity.givenName ?? undefined,
      lastName: identity.familyName ?? undefined,
      name: identity.name ?? undefined,
      color: "#2563EB",
      createdAt: now,
      updatedAt: now,
    });
  },
});
