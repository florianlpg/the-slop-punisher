"use client";

import { FC, Dispatch, SetStateAction } from "react";
import { UserProfile } from "@clerk/nextjs";

type AccountDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const AccountDialog: FC<AccountDialogProps> = ({
  open,
  setOpen,
}) => {
  return (
    <div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UserProfile routing="hash" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDialog;
