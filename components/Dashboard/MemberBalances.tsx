"use client"

import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type MemberBalance = {
  userId: string
  username?: string
  firstName?: string
  lastName?: string
  name?: string
  owedCents: number
  paidCents: number
  balanceCents: number
}

type MemberBalancesProps = {
  balances: MemberBalance[]
}

function getUserName(
  user: MemberBalance,
) {
  if (user.name) {
    return user.name
  }

  if (user.username) {
    return user.username
  }

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()

  if (fullName) {
    return fullName
  }

  return "Unknown user"
}

function formatCurrency(
  cents: number,
) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}

export function MemberBalances({
  balances,
}: MemberBalancesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Member balances
        </CardTitle>

        <CardDescription>
          Current balance for every member.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {balances.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            No members yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="h-10 px-2 font-medium">
                    Member
                  </th>

                  <th className="h-10 px-2 text-right font-medium">
                    Owed
                  </th>

                  <th className="h-10 px-2 text-right font-medium">
                    Paid
                  </th>

                  <th className="h-10 px-2 text-right font-medium">
                    Balance
                  </th>
                </tr>
              </thead>

              <tbody>
                {balances.map(
                  (member) => {
                    const balance =
                      member.balanceCents

                    return (
                      <tr
                        key={member.userId}
                        className="border-b last:border-0"
                      >
                        <td className="px-2 py-3">
                          <Link
                            href={`/users/${member.userId}`}
                            className="font-medium hover:underline"
                          >
                            {getUserName(
                              member,
                            )}
                          </Link>
                        </td>

                        <td className="px-2 py-3 text-right tabular-nums">
                          {formatCurrency(
                            member.owedCents,
                          )}
                        </td>

                        <td className="px-2 py-3 text-right tabular-nums">
                          {formatCurrency(
                            member.paidCents,
                          )}
                        </td>

                        <td
                          className={`px-2 py-3 text-right font-medium tabular-nums ${
                            balance > 0
                              ? "text-destructive"
                              : balance < 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : ""
                          }`}
                        >
                          {formatCurrency(
                            balance,
                          )}
                        </td>
                      </tr>
                    )
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
