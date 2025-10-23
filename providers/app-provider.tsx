"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/providers/theme-provider";
import { initMockServiceWorker } from "@/lib/msw/browser";
import { Toaster } from "@/components/ui/toaster";
import { ensureStorageSeed } from "@/lib/store";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  React.useEffect(() => {
    ensureStorageSeed();
    initMockServiceWorker();
  }, []);

  React.useEffect(() => {
    document.body.dataset.route = pathname ?? "/";
  }, [pathname]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
