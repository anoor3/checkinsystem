"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn, titleCase } from "@/lib/utils";

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean) ?? [];

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <Link href="/dashboard" className="transition-colors hover:text-foreground">
        Dashboard
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        return (
          <span key={segment} className="flex items-center">
            <ChevronRight className="mx-2 h-3 w-3" aria-hidden />
            <Link href={href} className="capitalize transition-colors hover:text-foreground">
              {segment.replace(/[-_]/g, " ")}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
