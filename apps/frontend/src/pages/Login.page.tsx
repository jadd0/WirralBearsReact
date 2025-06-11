import { LoginForm } from "@/components/login-form";
import { useMe } from "@hooks/auth.hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  const { isLoading, error } = useMe();

  
  if (isLoading)
    return (
      <div>
        <Skeleton className="h-16 w-16" />
      </div>
    );
  if (error) return `Error: ${error.message}`;

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="grow flex items-center justify-center h-full">
        <LoginForm className="flex xl:w-lg lg:w-96 w-96 sm:w-lg h-full items-center justify-center border-0" />
      </div>
    </div>
  );
}
