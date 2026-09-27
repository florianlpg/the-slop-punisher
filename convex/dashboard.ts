import { query } from "./_generated/server";

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const [users, infractions, transactions, rules, logs] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("infractions").collect(),
      ctx.db.query("transactions").collect(),
      ctx.db.query("rules").collect(),
      ctx.db.query("logs").order("desc").take(10),
    ]);

    const confirmedInfractions = infractions.filter(
      (infraction) => infraction.status === "confirmed",
    );

    const confirmedTransactions = transactions.filter(
      (transaction) => transaction.status === "confirmed",
    );

    const pendingInfractions = infractions.filter(
      (infraction) => infraction.status === "pending",
    );

    const pendingTransactions = transactions.filter(
      (transaction) => transaction.status === "pending",
    );

    const proposedRules = rules.filter((rule) => rule.status === "proposed");

    const totalPenaltiesCents = confirmedInfractions.reduce(
      (total, infraction) => total + infraction.amountCents,
      0,
    );

    const totalCollectedCents = confirmedTransactions.reduce(
      (total, transaction) => total + transaction.amountCents,
      0,
    );

    const totalOutstandingCents = totalPenaltiesCents - totalCollectedCents;

    /*
     * Calculate each member's current balance.
     *
     * Positive balance:
     *   The member owes money.
     *
     * Negative balance:
     *   The member has paid more than they owe.
     */
    const balanceMap = new Map<
      string,
      {
        owedCents: number;
        paidCents: number;
      }
    >();

    for (const user of users) {
      balanceMap.set(user.clerkUserId, {
        owedCents: 0,
        paidCents: 0,
      });
    }

    for (const infraction of confirmedInfractions) {
      const balance = balanceMap.get(infraction.accusedUserId);

      if (balance) {
        balance.owedCents += infraction.amountCents;
      }
    }

    for (const transaction of confirmedTransactions) {
      const balance = balanceMap.get(transaction.userId);

      if (balance) {
        balance.paidCents += transaction.amountCents;
      }
    }

    const memberBalances = users
      .map((user) => {
        const balance = balanceMap.get(user.clerkUserId);

        const owedCents = balance?.owedCents ?? 0;

        const paidCents = balance?.paidCents ?? 0;

        return {
          userId: user.clerkUserId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          color: user.color,
          owedCents,
          paidCents,
          balanceCents: owedCents - paidCents,
        };
      })
      .sort((a, b) => b.balanceCents - a.balanceCents);

    /*
     * The chart needs enough historical data to display
     * the last year.
     *
     * We keep one year + a small buffer of history and
     * calculate the balance immediately before that
     * period so the graph does not incorrectly start at €0.
     */
    const now = Date.now();

    const chartHistoryStart = now - 366 * 24 * 60 * 60 * 1000;

    const chartInfractions = confirmedInfractions.filter(
      (infraction) => infraction.createdAt >= chartHistoryStart,
    );

    const chartTransactions = confirmedTransactions.filter(
      (transaction) => transaction.createdAt >= chartHistoryStart,
    );

    /*
     * Calculate each user's balance immediately before
     * the chart history starts.
     *
     * This becomes the starting point for the frontend
     * chart calculation.
     */
    const startingBalanceMap = new Map<string, number>();

    for (const user of users) {
      startingBalanceMap.set(user.clerkUserId, 0);
    }

    for (const infraction of confirmedInfractions) {
      if (infraction.createdAt >= chartHistoryStart) {
        continue;
      }

      const current = startingBalanceMap.get(infraction.accusedUserId) ?? 0;

      startingBalanceMap.set(
        infraction.accusedUserId,
        current + infraction.amountCents,
      );
    }

    for (const transaction of confirmedTransactions) {
      if (transaction.createdAt >= chartHistoryStart) {
        continue;
      }

      const current = startingBalanceMap.get(transaction.userId) ?? 0;

      startingBalanceMap.set(
        transaction.userId,
        current - transaction.amountCents,
      );
    }

    const startingBalances = Object.fromEntries(
      users.map((user) => [
        user.clerkUserId,
        startingBalanceMap.get(user.clerkUserId) ?? 0,
      ]),
    );

    /*
     * Build the list of users used by the chart.
     */
    const chartUsers = users.map((user) => {
      const fullName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ");

      const name = user.name ?? user.username ?? (fullName || "Unknown user");

      return {
        id: user.clerkUserId,
        name,
        color: user.color ?? "var(--chart-1)",
      };
    });

    /*
     * Maps used to resolve actors and targets
     * for recent activity.
     */
    const usersById = new Map(users.map((user) => [user.clerkUserId, user]));

    const recentActivity = logs.map((log) => {
      const actor = usersById.get(log.actorUserId);

      const target = log.targetUserId
        ? usersById.get(log.targetUserId)
        : undefined;

      return {
        _id: log._id,
        actorUserId: log.actorUserId,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        targetUserId: log.targetUserId,
        metadata: log.metadata,
        createdAt: log.createdAt,

        actor: actor
          ? {
              username: actor.username,
              firstName: actor.firstName,
              lastName: actor.lastName,
              name: actor.name,
            }
          : null,

        targetUser: target
          ? {
              username: target.username,
              firstName: target.firstName,
              lastName: target.lastName,
              name: target.name,
            }
          : null,
      };
    });

    return {
      stats: {
        totalOutstandingCents,
        totalPenaltiesCents,
        totalCollectedCents,

        pendingApprovals:
          pendingInfractions.length +
          pendingTransactions.length +
          proposedRules.length,

        memberCount: users.length,
      },

      attention: {
        pendingPenalties: pendingInfractions.length,

        pendingTransactions: pendingTransactions.length,

        proposedRules: proposedRules.length,
      },

      memberBalances,

      chart: {
        users: chartUsers,

        /*
         * Only events inside the chart history are sent
         * to the client. startingBalances contains the
         * balance accumulated before this history.
         */
        infractions: chartInfractions.map((infraction) => ({
          userId: infraction.accusedUserId,

          amountCents: infraction.amountCents,

          createdAt: infraction.createdAt,
        })),

        transactions: chartTransactions.map((transaction) => ({
          userId: transaction.userId,

          amountCents: transaction.amountCents,

          createdAt: transaction.createdAt,
        })),

        startingBalances,
      },

      recentActivity,
    };
  },
});
