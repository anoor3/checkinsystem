const keys = {
  user: "pulse_user",
  classes: "pulse_classes",
  enrollments: "pulse_enrollments",
  sessions: "pulse_sessions",
  checkins: "pulse_checkins",
};

export type StorageKey = keyof typeof keys;

export const storage = {
  get<T>(key: StorageKey): T | null {
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem(keys[key]);
    return value ? (JSON.parse(value) as T) : null;
  },
  set<T>(key: StorageKey, value: T) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(keys[key], JSON.stringify(value));
  },
  ensure<T>(key: StorageKey, fallback: T): T {
    const existing = this.get<T>(key);
    if (existing) return existing;
    this.set(key, fallback);
    return fallback;
  },
  clear() {
    if (typeof window === "undefined") return;
    Object.values(keys).forEach((key) => window.localStorage.removeItem(key));
  },
};

export function getStorageSnapshot() {
  if (typeof window === "undefined") return null;
  return {
    user: storage.get("user"),
    classes: storage.get("classes"),
    enrollments: storage.get("enrollments"),
    sessions: storage.get("sessions"),
    checkins: storage.get("checkins"),
  };
}
