"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CirclePlusIcon } from "lucide-react";

export function QuickCreateDialog() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [ruleId, setRuleId] = useState<Id<"rules"> | undefined>();
  const [quantity, setQuantity] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const users = useQuery(api.users.list);
  const rules = useQuery(api.rules.active);

  const createInfraction = useMutation(api.infractions.create);

  const selectedUser = users?.find((user) => user.clerkUserId === userId);

  const selectedRule = rules?.find((rule) => rule._id === ruleId);

  const parsedQuantity = Number(quantity);

  const totalAmountCents =
    selectedRule && Number.isFinite(parsedQuantity)
      ? selectedRule.fineAmountCents * parsedQuantity
      : 0;

  const formatAmount = (cents: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);

  const getUserDisplayName = (user: NonNullable<typeof users>[number]) => {
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

    return name || user.name || user.username || "Unknown user";
  };

  const handleCreate = async () => {
    if (
      !userId ||
      !ruleId ||
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createInfraction({
        ruleId,
        accusedUserId: userId,
        quantity: parsedQuantity,
        note: undefined,
      });

      setOpen(false);
      setUserId(undefined);
      setRuleId(undefined);
      setQuantity("1");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          className: "w-full min-w-8",
        })}
      >
        <CirclePlusIcon />
        <span>Quick Create</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create infraction</DialogTitle>

          <DialogDescription>
            Select a user, choose the rule, then specify the amount.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User */}
          <div className="space-y-2">
            <Label>User</Label>

            <Select
              value={userId}
              onValueChange={(value) => {
                setUserId(value ?? undefined);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user...">
                  {selectedUser ? getUserDisplayName(selectedUser) : undefined}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.clerkUserId} value={user.clerkUserId}>
                    {getUserDisplayName(user)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rule */}
          <div className="space-y-2">
            <Label>Rule</Label>

            <Select
              value={ruleId}
              onValueChange={(value) => {
                setRuleId(value ? (value as Id<"rules">) : undefined);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a rule...">
                  {selectedRule?.description}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {rules?.map((rule) => (
                  <SelectItem key={rule._id} value={rule._id}>
                    {rule.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          {selectedRule && (
            <div className="space-y-2">
              <Label>Amount</Label>

              <Input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                }}
              />

              <p className="text-sm text-muted-foreground">
                {formatAmount(selectedRule.fineAmountCents)} per{" "}
                {selectedRule.unit === "custom"
                  ? selectedRule.customUnitLabel
                  : selectedRule.unit}
              </p>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>

                  <span className="font-semibold">
                    {formatAmount(totalAmountCents)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            disabled={
              !userId ||
              !ruleId ||
              !Number.isFinite(parsedQuantity) ||
              parsedQuantity <= 0 ||
              isSubmitting
            }
            onClick={handleCreate}
          >
            {isSubmitting ? "Creating..." : "Create infraction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
