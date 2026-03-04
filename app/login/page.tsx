"use client"

import { LoginForm } from "@/components/login-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { Toaster } from "sonner";

export default function LoginPage() {
  const { data, status } = useSession();

  if (status == "loading")
    return (
      <div>
        <Skeleton className="h-16 w-16" />
      </div>
    );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="grow flex items-center justify-center h-full">
        <LoginForm className="flex xl:w-lg lg:w-96 w-96 sm:w-lg h-full items-center justify-center border-0" />
      </div>

      <Toaster
        position="top-center"
        richColors
        expand={false}
        duration={4000}
      />
    </div>
  );
}
