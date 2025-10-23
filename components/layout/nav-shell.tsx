"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Home, Layers3, QrCode, Settings, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/domain";

interface NavShellProps {
  profile: Profile;
  children: React.ReactNode;
}

const navLinks = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/classes/new", label: "Create Class", icon: Sparkles },
  { href: "/join", label: "Join", icon: QrCode },
  { href: "/history", label: "History", icon: Layers3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavShell({ profile, children }: NavShellProps) {
  const pathname = usePathname();
  const roleAccent = profile.role === "professor" ? "from-indigo-500 to-sky-500" : "from-emerald-500 to-teal-400";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <GraduationCap className="h-6 w-6 text-primary" />
            PulseCheck
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" className="gap-2">
              <div className={cn("relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br", roleAccent)}>
                <Avatar>
                  <AvatarFallback className="bg-transparent text-sm font-semibold text-white">
                    {profile.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold">{profile.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
              </div>
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row">
        <aside className="flex w-full flex-row gap-3 overflow-x-auto rounded-lg border bg-card/60 p-4 md:h-fit md:w-60 md:flex-col md:gap-2">
          {navLinks.map((link) => {
            if (profile.role === "student" && link.href === "/classes/new") return null;
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="flex-1">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-lg border px-3 text-sm font-medium transition",
                    isActive
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-transparent bg-muted/40 text-muted-foreground hover:border-border hover:bg-background hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </motion.div>
              </Link>
            );
          })}
          <div className="hidden md:block">
            <div className="rounded-xl border border-dashed p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Need a refresher?</p>
              <p>Open the session from your dashboard and share the rotating QR to invite instant check-ins.</p>
            </div>
          </div>
        </aside>
        <main className="flex-1 pb-16">
          <div className="grid gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
