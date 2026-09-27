"use client"

import type {
  Dispatch,
  SetStateAction,
} from "react"

import { UserProfile } from "@clerk/nextjs"

type AccountDialogProps = {
  open: boolean
  setOpen: Dispatch<
    SetStateAction<boolean>
  >
}

export function AccountDialog({
  open,
  setOpen,
}: AccountDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <UserProfile routing="hash" />
      </div>
    </div>
  )
}

export default AccountDialog
