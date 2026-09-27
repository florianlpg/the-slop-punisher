"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return { logout };
};
