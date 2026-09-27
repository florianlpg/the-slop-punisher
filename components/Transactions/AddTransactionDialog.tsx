"use client";

import { useState } from "react";

import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { buttonVariants, Button } from "@/components/ui/button";

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

function formatAmount(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);

  const [userId, setUserId] = useState<string | undefined>();

  const [amount, setAmount] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const users = useQuery(api.users.list);

  const createTransaction = useMutation(api.transactions.create);

  const selectedUser = users?.find((user) => user.clerkUserId === userId);

  const amountCents = Math.round(Number(amount) * 100);

  const getUserDisplayName = (user: NonNullable<typeof users>[number]) => {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

    return fullName || user.name || user.username || "Unknown user";
  };

  const handleCreate = async () => {
    if (!userId || !Number.isFinite(amountCents) || amountCents <= 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createTransaction({
        userId,
        amountCents,
      });

      setOpen(false);
      setUserId(undefined);
      setAmount("");
    } catch (error) {
      console.error("Failed to create transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants()}>
        <CirclePlusIcon />
        <span>Add transaction</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record cash payment</DialogTitle>

          <DialogDescription>
            Record a cash payment made by a user. The transaction must be
            approved by every user before it is confirmed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>User</Label>

            <Select
              value={userId}
              onValueChange={(value) => setUserId(value || undefined)}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label>Cash received</Label>

            <Input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />

            <p className="text-sm text-muted-foreground">
              Payment method: Cash
            </p>
          </div>

          {amountCents > 0 && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>

                <span className="font-semibold">
                  {formatAmount(amountCents)}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            This transaction will remain pending until every user approves it.
          </div>

          <Button
            className="w-full"
            disabled={
              !userId ||
              !Number.isFinite(amountCents) ||
              amountCents <= 0 ||
              isSubmitting
            }
            onClick={handleCreate}
          >
            {isSubmitting ? "Recording..." : "Record payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
