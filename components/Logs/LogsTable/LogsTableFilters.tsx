"use client"

import * as React from "react"

import type { LogTableRow } from "@/app/logs/types"

export type LogsFilters = {
  actor: string
  target: string
  action: string
  entityType: string
  entityId: string
  vote: string
  previousStatus: string
  newStatus: string
  dateFrom: string
  dateTo: string
}

type LogsTableFiltersProps = {
  data: LogTableRow[]
  filters: LogsFilters
  onFiltersChange: (
    filters: LogsFilters,
  ) => void
}

const actions = [
  ["user_created", "User created"],
  ["rule_created", "Rule created"],
  ["rule_updated", "Rule updated"],
  ["rule_vote", "Rule vote"],
  ["rule_confirmed", "Rule confirmed"],
  ["rule_rejected", "Rule rejected"],
  ["infraction_created", "Infraction created"],
  ["infraction_vote", "Infraction vote"],
  ["infraction_confirmed", "Infraction confirmed"],
  ["infraction_rejected", "Infraction rejected"],
  ["transaction_created", "Transaction created"],
  ["transaction_vote", "Transaction vote"],
  ["transaction_confirmed", "Transaction confirmed"],
  ["transaction_rejected", "Transaction rejected"],
  ["login", "Login"],
  ["logout", "Logout"],
] as const

const entityTypes = [
  ["user", "User"],
  ["rule", "Rule"],
  ["infraction", "Infraction"],
  ["transaction", "Transaction"],
] as const

const statuses = [
  ["pending", "Pending"],
  ["confirmed", "Confirmed"],
  ["rejected", "Rejected"],
  ["proposed", "Proposed"],
  ["active", "Active"],
  ["archived", "Archived"],
] as const

export function LogsTableFilters({
  data,
  filters,
  onFiltersChange,
}: LogsTableFiltersProps) {
  const actors = React.useMemo(() => {
    const users = new Map<
      string,
      NonNullable<LogTableRow["actor"]>
    >()

    for (const log of data) {
      if (!log.actor) {
        continue
      }

      users.set(log.actor.clerkUserId, log.actor)
    }

    return Array.from(users.values()).sort(
      (a, b) =>
        getUserLabel(a).localeCompare(
          getUserLabel(b),
        ),
    )
  }, [data])

  const targets = React.useMemo(() => {
    const users = new Map<
      string,
      NonNullable<LogTableRow["targetUser"]>
    >()

    for (const log of data) {
      if (!log.targetUser) {
        continue
      }

      users.set(
        log.targetUser.clerkUserId,
        log.targetUser,
      )
    }

    return Array.from(users.values()).sort(
      (a, b) =>
        getUserLabel(a).localeCompare(
          getUserLabel(b),
        ),
    )
  }, [data])

  const updateFilter = <K extends keyof LogsFilters>(
    key: K,
    value: LogsFilters[K],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      actor: "all",
      target: "all",
      action: "all",
      entityType: "all",
      entityId: "",
      vote: "all",
      previousStatus: "all",
      newStatus: "all",
      dateFrom: "",
      dateTo: "",
    })
  }

  const hasFilters =
    filters.actor !== "all" ||
    filters.target !== "all" ||
    filters.action !== "all" ||
    filters.entityType !== "all" ||
    filters.entityId !== "" ||
    filters.vote !== "all" ||
    filters.previousStatus !== "all" ||
    filters.newStatus !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== ""

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect
          label="Actor"
          value={filters.actor}
          onChange={(value) =>
            updateFilter("actor", value)
          }
        >
          <option value="all">All actors</option>

          {actors.map((user) => (
            <option
              key={user.clerkUserId}
              value={user.clerkUserId}
            >
              {getUserLabel(user)}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Target"
          value={filters.target}
          onChange={(value) =>
            updateFilter("target", value)
          }
        >
          <option value="all">All targets</option>

          {targets.map((user) => (
            <option
              key={user.clerkUserId}
              value={user.clerkUserId}
            >
              {getUserLabel(user)}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Action"
          value={filters.action}
          onChange={(value) =>
            updateFilter("action", value)
          }
        >
          <option value="all">All actions</option>

          {actions.map(([value, label]) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Entity"
          value={filters.entityType}
          onChange={(value) =>
            updateFilter(
              "entityType",
              value,
            )
          }
        >
          <option value="all">
            All entities
          </option>

          {entityTypes.map(
            ([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ),
          )}
        </FilterSelect>

        <FilterSelect
          label="Vote"
          value={filters.vote}
          onChange={(value) =>
            updateFilter("vote", value)
          }
        >
          <option value="all">All votes</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </FilterSelect>

        <FilterSelect
          label="Previous status"
          value={filters.previousStatus}
          onChange={(value) =>
            updateFilter(
              "previousStatus",
              value,
            )
          }
        >
          <option value="all">
            All previous statuses
          </option>

          {statuses.map(
            ([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ),
          )}
        </FilterSelect>

        <FilterSelect
          label="New status"
          value={filters.newStatus}
          onChange={(value) =>
            updateFilter(
              "newStatus",
              value,
            )
          }
        >
          <option value="all">
            All new statuses
          </option>

          {statuses.map(
            ([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ),
          )}
        </FilterSelect>

        <FilterInput
          label="Entity ID"
          value={filters.entityId}
          placeholder="Search entity ID..."
          onChange={(value) =>
            updateFilter(
              "entityId",
              value,
            )
          }
        />

        <FilterInput
          label="From"
          type="date"
          value={filters.dateFrom}
          onChange={(value) =>
            updateFilter(
              "dateFrom",
              value,
            )
          }
        />

        <FilterInput
          label="To"
          type="date"
          value={filters.dateTo}
          onChange={(value) =>
            updateFilter(
              "dateTo",
              value,
            )
          }
        />

        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="h-9 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  )
}

type FilterSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: FilterSelectProps) {
  return (
    <div className="flex min-w-40 flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        {children}
      </select>
    </div>
  )
}

type FilterInputProps = {
  label: string
  value: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  onChange: (value: string) => void
}

function FilterInput({
  label,
  value,
  type = "text",
  placeholder,
  onChange,
}: FilterInputProps) {
  return (
    <div className="flex min-w-40 flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-9 rounded-md border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}

function getUserLabel(
  user:
    | LogTableRow["actor"]
    | LogTableRow["targetUser"],
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

  return user.clerkUserId
}
