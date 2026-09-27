"use client";

import { useAuth, useClerk, useSignIn } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginCredentials = {
  username: string;
  password: string;
};

type ClerkError = {
  code?: string;
  message?: string;
  longMessage?: string;
};

type ClerkErrorResponse = {
  errors?: ClerkError[];
};

type UseLoginReturn = {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "errors" in error) {
    const response = error as ClerkErrorResponse;
    const firstError = response.errors?.[0];

    if (firstError) {
      console.error("Clerk error:", {
        code: firstError.code,
        message: firstError.message,
        longMessage: firstError.longMessage,
      });

      return [firstError.code, firstError.longMessage ?? firstError.message]
        .filter(Boolean)
        .join(": ");
    }
  }

  if (error instanceof Error) {
    console.error("Login error:", error);
    return error.message;
  }

  console.error("Unknown login error:", error);

  return "An unknown error occurred.";
}

export function useLogin(): UseLoginReturn {
  const router = useRouter();

  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { setActive } = useClerk();

  const {
    isLoaded: isAuthLoaded,
    isSignedIn,
    signOut,
  } = useAuth();

  const ensureUser = useMutation(api.users.ensureUser);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({
    username,
    password,
  }: LoginCredentials): Promise<void> => {
    if (!isSignInLoaded || !isAuthLoaded) {
      console.warn("Clerk is not loaded yet.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isSignedIn) {
        console.log(
          "Existing Clerk session found. Signing it out before login...",
        );

        await signOut();

        console.log("Existing Clerk session revoked.");
      }

      const result = await signIn.create({
        identifier: username,
        password,
      });

      if (result.status !== "complete") {
        setError(
          `Clerk sign-in is not complete. Status: ${result.status}`,
        );
        return;
      }

      if (!result.createdSessionId) {
        setError(
          "Clerk sign-in completed but no session ID was returned.",
        );
        return;
      }

      console.log(
        "New Clerk session created:",
        result.createdSessionId,
      );

      await setActive({
        session: result.createdSessionId,
      });

      console.log("Clerk session activated.");

      await ensureUser();

      console.log("Convex user ensured.");

      router.replace("/dashboard");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}
