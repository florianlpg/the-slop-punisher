"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  CircleAlertIcon,
  FileCheck2Icon,
  ReceiptTextIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type DashboardAttention = {
  pendingPenalties: number
  pendingTransactions: number
  proposedRules: number
}

type NeedsAttentionProps = {
  attention: DashboardAttention
}

type AttentionItemProps = {
  count: number
  label: string
  href: string
  icon: React.ComponentType<{
    className?: string
  }>
}

function AttentionItem({
  count,
  label,
  href,
  icon: Icon,
}: AttentionItemProps) {
  if (count === 0) {
    return null
  }

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {count} {label}
        </p>

        <p className="text-xs text-muted-foreground">
          Requires your attention
        </p>
      </div>

      <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

export function NeedsAttention({
  attention,
}: NeedsAttentionProps) {
  const total =
    attention.pendingPenalties +
    attention.pendingTransactions +
    attention.proposedRules

  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs attention</CardTitle>
        <CardDescription>
          Items waiting for approval or review.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {total === 0 ? (
          <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted">
              <CircleAlertIcon className="size-4 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">
              Everything is up to date
            </p>

            <p className="text-xs text-muted-foreground">
              There are no pending approvals.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <AttentionItem
              count={attention.pendingPenalties}
              label={
                attention.pendingPenalties === 1
                  ? "penalty awaiting approval"
                  : "penalties awaiting approval"
              }
              href="/approbations"
              icon={ReceiptTextIcon}
            />

            <AttentionItem
              count={attention.pendingTransactions}
              label={
                attention.pendingTransactions === 1
                  ? "transaction awaiting approval"
                  : "transactions awaiting approval"
              }
              href="/transactions"
              icon={FileCheck2Icon}
            />

            <AttentionItem
              count={attention.proposedRules}
              label={
                attention.proposedRules === 1
                  ? "proposed rule"
                  : "proposed rules"
              }
              href="/rules"
              icon={CircleAlertIcon}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
