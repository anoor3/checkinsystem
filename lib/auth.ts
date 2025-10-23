"use client";

import * as React from "react";
import { storage } from "@/lib/storage";
import type { Profile } from "@/types/domain";

export function useCurrentProfile() {
  const [profile, setProfile] = React.useState<Profile | null>(null);

  React.useEffect(() => {
    const stored = storage.get<Profile>("user");
    if (stored) {
      setProfile(stored);
    }
  }, []);

  return { profile, setProfile } as const;
}

export function setCurrentProfile(profile: Profile) {
  storage.set("user", profile);
}

export function signOut() {
  storage.clear();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
