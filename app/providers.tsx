"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
