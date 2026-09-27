import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/auth/login");
  } else {
    redirect("/dashboard");
  }
}
