"use client"

import {
  CircleCheckIcon,
  CirclePlusIcon,
  CircleXIcon,
  CreditCardIcon,
  GavelIcon,
  ReceiptTextIcon,
  UserPlusIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ActivityUser = {
  username?: string
  firstName?: string
  lastName?: string
  name?: string
} | null

type Activity = {
  _id: string
  action:
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
    | "logout"
  entityType:
    | "user"
    | "rule"
    | "infraction"
    | "transaction"
  createdAt: number
  actor: ActivityUser
  targetUser: ActivityUser
  metadata?: {
    description?: string
    amountCents?: number
    quantity?: number
    vote?: "yes" | "no"
    previousStatus?: string
    newStatus?: string
  }
}

type RecentActivityProps = {
  activities: Activity[]
}

function getUserName(
  user: ActivityUser,
) {
  if (!user) {
    return "Unknown user"
  }

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

function formatRelativeTime(
  timestamp: number,
) {
  const diff =
    Date.now() - timestamp

  const seconds = Math.floor(
    diff / 1000,
  )

  if (seconds < 60) {
    return "Just now"
  }

  const minutes = Math.floor(
    seconds / 60,
  )

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(
    minutes / 60,
  )

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(
    hours / 24,
  )

  if (days < 7) {
    return `${days}d ago`
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "medium",
    },
  ).format(new Date(timestamp))
}

function getActivityIcon(
  activity: Activity,
) {
  switch (activity.action) {
    case "user_created":
      return UserPlusIcon

    case "rule_created":
      return CirclePlusIcon

    case "rule_confirmed":
    case "infraction_confirmed":
    case "transaction_confirmed":
      return CircleCheckIcon

    case "rule_rejected":
    case "infraction_rejected":
    case "transaction_rejected":
      return CircleXIcon

    case "transaction_created":
      return CreditCardIcon

    case "infraction_created":
    case "infraction_vote":
      return ReceiptTextIcon

    case "rule_vote":
    case "rule_updated":
      return GavelIcon

    default:
      return CirclePlusIcon
  }
}

function getActivityDescription(
  activity: Activity,
) {
  const actor = getUserName(
    activity.actor,
  )

  switch (activity.action) {
    case "user_created":
      return `${actor} joined the group`

    case "rule_created":
      return `${actor} created a rule`

    case "rule_updated":
      return `${actor} updated a rule`

    case "rule_vote":
      return `${actor} voted on a rule`

    case "rule_confirmed":
      return `A rule was approved`

    case "rule_rejected":
      return `A rule was rejected`

    case "infraction_created":
      return `${actor} reported a penalty`

    case "infraction_vote":
      return `${actor} voted on a penalty`

    case "infraction_confirmed":
      return `A penalty was confirmed`

    case "infraction_rejected":
      return `A penalty was rejected`

    case "transaction_created": {
      const amount =
        activity.metadata?.amountCents

      if (amount !== undefined) {
        return `${actor} recorded a ${formatCurrency(amount)} payment`
      }

      return `${actor} recorded a payment`
    }

    case "transaction_vote":
      return `${actor} voted on a payment`

    case "transaction_confirmed":
      return `A payment was confirmed`

    case "transaction_rejected":
      return `A payment was rejected`

    case "login":
      return `${actor} logged in`

    case "logout":
      return `${actor} logged out`

    default:
      return "Activity recorded"
  }
}

export function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            No activity yet.
          </div>
        ) : (
          <div className="flex flex-col">
            {activities.map(
              (activity) => {
                const Icon =
                  getActivityIcon(
                    activity,
                  )

                return (
                  <div
                    key={activity._id}
                    className="flex items-center gap-3 border-b py-3 last:border-0"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">
                        {getActivityDescription(
                          activity,
                        )}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(
                          activity.createdAt,
                        )}
                      </p>
                    </div>
                  </div>
                )
              },
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
