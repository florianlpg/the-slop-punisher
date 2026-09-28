"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.replace("/auth/login");
    router.refresh();
  };

  return { logout };
};
