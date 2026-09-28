import { LoginForm } from "@/components/Login/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-start bg-muted px-4 py-6 sm:justify-center sm:p-6 md:p-10">
      <div className="w-full max-w-md md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
