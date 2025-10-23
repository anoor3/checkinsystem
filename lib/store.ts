import { seed } from "@/data/fixtures";
import type { Checkin, Class, Enrollment, Profile, Session } from "@/types/domain";
import { storage } from "@/lib/storage";

export interface PulseState {
  profiles: Profile[];
  classes: Class[];
  enrollments: Enrollment[];
  sessions: Session[];
  checkins: Checkin[];
}

let memoryState: PulseState = JSON.parse(JSON.stringify(seed));

function cloneState(): PulseState {
  return JSON.parse(JSON.stringify(memoryState));
}

export function getState(): PulseState {
  return cloneState();
}

export function setState(next: PulseState) {
  memoryState = JSON.parse(JSON.stringify(next));
}

export function resetState() {
  memoryState = JSON.parse(JSON.stringify(seed));
}

export function ensureStorageSeed() {
  if (typeof window === "undefined") return;
  storage.ensure("classes", seed.classes);
  storage.ensure("sessions", seed.sessions);
  storage.ensure("enrollments", seed.enrollments);
  storage.ensure("checkins", seed.checkins);
}
