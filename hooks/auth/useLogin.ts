"use client";

import { useClerk, useSignIn } from "@clerk/nextjs";
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
  if (
    error &&
    typeof error === "object" &&
    "errors" in error
  ) {
    const response = error as ClerkErrorResponse;
    const firstError = response.errors?.[0];

    if (firstError) {
      console.error("Clerk error:", {
        code: firstError.code,
        message: firstError.message,
        longMessage: firstError.longMessage,
      });

      return [
        firstError.code,
        firstError.longMessage ?? firstError.message,
      ]
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

  const {
    signIn,
    isLoaded: isSignInLoaded,
  } = useSignIn();

  const { setActive } = useClerk();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({
    username,
    password,
  }: LoginCredentials): Promise<void> => {
    if (!isSignInLoaded) {
      console.warn("Clerk SignIn is not loaded yet.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting Clerk login...", {
        username,
      });

      const result = await signIn.create({
        identifier: username,
        password,
      });

      console.log("Clerk sign-in result:", {
        status: result.status,
        createdSessionId: result.createdSessionId,
        firstFactorVerification: result.firstFactorVerification,
        secondFactorVerification: result.secondFactorVerification,
      });

      if (result.status !== "complete") {
        const message =
          `Clerk sign-in is not complete. Status: ${result.status}`;

        console.warn(message, result);

        setError(message);
        return;
      }

      if (!result.createdSessionId) {
        const message =
          "Clerk sign-in completed but no session ID was returned.";

        console.error(message, result);

        setError(message);
        return;
      }

      console.log(
        "Activating Clerk session:",
        result.createdSessionId,
      );

      await setActive({
        session: result.createdSessionId,
      });

      console.log("Clerk session activated successfully.");

      router.push("/dashboard");
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      setError(message);
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
