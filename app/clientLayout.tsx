"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/lib/frontend/components/layout/Navbar";
import { AdminNavbar } from "@/lib/frontend/components/layout/AdminNavbar";
import { useSession } from "next-auth/react";

export function ClientLayout({ children }: { children: ReactNode }) {
  const { status } = useSession();

  const pathname = usePathname();

  const shouldShowNav = useMemo(() => {
    if (pathname.startsWith("/admin")) return false;

    const otherHiddenRoutes = ["/login", "/logout", "/logout/"];
    return !otherHiddenRoutes.includes(pathname);
  }, [pathname]);

  return (
    <>
      {shouldShowNav && <Navbar />}
      {!shouldShowNav && status == "authenticated" && <AdminNavbar />}
      {children}
    </>
  );
}
