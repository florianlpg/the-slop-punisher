"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { type RuleTableRow } from "@/app/rules/types";
import { columnHelper } from "./helper";

function ActionsCell({ rule }: { rule: RuleTableRow }) {
  const archiveRule = useMutation(api.rules.archive);
  const [isArchiving, setIsArchiving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleArchive = async () => {
    if (isArchiving) {
      return;
    }

    setIsArchiving(true);

    try {
      await archiveRule({
        ruleId: rule._id,
      });

      setOpen(false);
    } catch (error) {
      console.error("Failed to archive rule:", error);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
          />
        }
      >
        <span className="sr-only">Remove rule</span>
        <Trash2 className="h-4 w-4" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this rule?</AlertDialogTitle>

          <AlertDialogDescription>
            &ldquo;{rule.description}&rdquo; will be archived. Past infractions
            tied to it are kept for history.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>

          <AlertDialogAction disabled={isArchiving} onClick={handleArchive}>
            {isArchiving ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const actionsColumn = columnHelper.display({
  id: "actions",
  cell: ({ row }) => <ActionsCell rule={row.original} />,
});
