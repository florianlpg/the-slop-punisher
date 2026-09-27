import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

import { columnHelper } from "./helper"

export const actionsColumn =
  columnHelper.display({
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      const transaction = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            disabled={
              transaction.status !== "pending"
            }
          >
            <Check />
            Approve
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={
              transaction.status !== "pending"
            }
          >
            <X />
            Reject
          </Button>
        </div>
      )
    },
  })
