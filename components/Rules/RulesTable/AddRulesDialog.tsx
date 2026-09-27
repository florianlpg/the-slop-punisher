"use client"

import * as React from "react"
import { useMutation } from "convex/react"
import { Plus } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { type RuleUnit } from "@/app/rules/types"

const unitOptions: { value: RuleUnit; label: string }[] = [
  { value: "occurrence", label: "Per infraction" },
  { value: "file", label: "Per file" },
  { value: "row", label: "Per row" },
  { value: "line", label: "Per line" },
  { value: "minute", label: "Per minute" },
  { value: "custom", label: "Custom…" },
]

export function AddRuleDialog() {
  const createRule = useMutation(api.rules.create)

  const [open, setOpen] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [fineAmount, setFineAmount] = React.useState("")
  const [unit, setUnit] = React.useState<RuleUnit>("occurrence")
  const [customUnitLabel, setCustomUnitLabel] = React.useState("")
  const [requiredApprovals, setRequiredApprovals] = React.useState("1")
  const [submitting, setSubmitting] = React.useState(false)

  function reset() {
    setDescription("")
    setFineAmount("")
    setUnit("occurrence")
    setCustomUnitLabel("")
    setRequiredApprovals("1")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = Number(fineAmount)
    const approvals = Number(requiredApprovals)
    if (!description.trim() || Number.isNaN(amount) || amount <= 0) return

    setSubmitting(true)
    try {
      await createRule({
        description: description.trim(),
        fineAmountCents: Math.round(amount * 100),
        unit,
        customUnitLabel: unit === "custom" ? customUnitLabel.trim() : undefined,
        requiredApprovalsToConfirm: Math.max(1, approvals || 1),
      })
      reset()
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4" />
        Add rule
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New rule</DialogTitle>
            <DialogDescription>
              This rule starts as proposed and needs everyone to vote yes before it becomes
              active.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="No pushing to main without a PR"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fine">Fine (EUR)</Label>
                <Input
                  id="fine"
                  type="number"
                  min="0"
                  step="0.01"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  placeholder="5.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Per</Label>
                <Select value={unit} onValueChange={(v) => setUnit(v as RuleUnit)}>
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {unit === "custom" && (
              <div className="grid gap-2">
                <Label htmlFor="customUnit">Custom unit label</Label>
                <Input
                  id="customUnit"
                  value={customUnitLabel}
                  onChange={(e) => setCustomUnitLabel(e.target.value)}
                  placeholder="per commit"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="approvals">Votes needed to confirm an infraction</Label>
              <Input
                id="approvals"
                type="number"
                min="1"
                value={requiredApprovals}
                onChange={(e) => setRequiredApprovals(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
