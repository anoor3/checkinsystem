"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { listProfiles } from "@/lib/api-client";
import type { Profile } from "@/types/domain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setCurrentProfile } from "@/lib/auth";

export default function SignInPage() {
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [filter, setFilter] = React.useState("");
  const router = useRouter();
  const params = useSearchParams();
  const roleFilter = params.get("role");

  React.useEffect(() => {
    listProfiles().then(setProfiles);
  }, []);

  const filtered = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(filter.toLowerCase()) && (!roleFilter || profile.role === roleFilter)
  );

  return (
    <div className="mx-auto grid min-h-screen max-w-4xl place-items-center px-6 py-16">
      <Card className="w-full border-none bg-card/80 shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back to PulseCheck</CardTitle>
          <CardDescription>Select a demo profile to continue—no passwords required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            placeholder="Search by name"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-sm"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((profile) => (
              <motion.button
                key={profile.id}
                onClick={() => {
                  setCurrentProfile(profile);
                  router.push(profile.role === "professor" ? "/dashboard" : "/join");
                }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 rounded-2xl border bg-background/70 p-4 text-left transition hover:border-primary/60 hover:bg-primary/5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-400 text-sm font-semibold text-primary-foreground">
                  {profile.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold">{profile.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
